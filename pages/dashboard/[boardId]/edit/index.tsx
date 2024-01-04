import sender from "@/apis/sender";
import Button from "@/components/Buttons/Button/Button";
import ChipColors from "@/components/Chips/ChipColors/ChipColors";
import Input from "@/components/Input/Input";
import InputWrapper from "@/components/Input/InputWrapper";
import TablePagination from "@/components/Table/TablePagination/TablePagination";
import useApi from "@/hooks/useApi";
import useInputController from "@/hooks/useInputController";
import AlertModal from "@/modals/AlertModal";
import { ColorType, InvitationData, Member } from "@/types/api.type";
import { getAccessTokenFromCookie } from "@/utils/getAccessToken";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import styles from "./DashboardEdit.module.css";
import MenuLayout from "@/components/MenuLayout/MenuLayout";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const accessToken = getAccessTokenFromCookie(context) as string;
  const boardId = Number(context.query["boardId"]);

  const { data: dashboard } = await sender.get({ path: "dashboard", id: boardId, accessToken });

  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      },
    };
  }

  const {
    data: { members },
  } = await sender.get({ path: "members", id: Number(boardId), accessToken });

  const {
    data: { invitations },
  } = await sender.get({ path: "dashboardInvitations", id: Number(boardId), accessToken });

  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      },
    };
  }

  return {
    props: { dashboard, accessToken, members, invitations },
  };
};

const DashboardEdit = ({
  dashboard,
  members,
  accessToken,
  invitations,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const boardId = router?.query.boardId;
  const [prevColor, setPrevColor] = useState(dashboard?.color ?? "#760dde");
  const [color, setColor] = useState<ColorType>(prevColor);

  const [memberList, setMemberList] = useState<(Member | InvitationData)[]>(members);

  const [invitationList, setInvitationList] = useState<(Member | InvitationData)[]>(invitations);
  const [boardName, setBoardName] = useState(dashboard?.title);

  const [isOpenDashboardDeleteModal, setIsOpenDashboardDeleteModal] = useState(false);
  const { pending, wrappedFunction } = useApi("delete");

  const handleDashboardDeleteModalToggle = () => {
    setIsOpenDashboardDeleteModal((prev) => !prev);
  };

  const handleDashboardDeleteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const deleteRes = await wrappedFunction({ path: "dashboard", id: Number(boardId), accessToken });

    if (deleteRes?.status === 204) {
      router.push(`/mydashboard`);
    }
  };

  const { wrapper, input } = useInputController({
    inputConfig: { id: "dashboardName" },
    labelConfig: { labelName: "대시보드 이름" },
  });

  const { wrappedFunction: putData } = useApi("put");

  const handleDashboardEditClick = async () => {
    const res = await putData({
      path: "dashboard",
      id: Number(boardId),
      data: { title: input.value, color },
      accessToken,
    });

    if (res?.status === 200) {
      setColor(color);
      setPrevColor(color);
      input.setValue("");
      setBoardName(res.data.title);
    }
  };

  return (
    <>
      <MenuLayout dashboard={dashboard}>
        <div className={styles.body}>
          <Link href={`/dashboard/${boardId}`} className={styles.back_button}>
            <Image width={20} height={20} alt="왼쪽 화살표 아이콘 " src="/icons/icon-arrowleft.svg" />
            <span>돌아가기</span>
          </Link>

          <div className={styles.name_edit_box}>
            <div className={styles.name_edit_header}>
              <span className={styles.dashboard_name}>{boardName}</span>
              <ChipColors size="lg" selectedColor={color} setSelectedColor={setColor} />
            </div>

            <InputWrapper {...wrapper}>
              <Input {...input} />
            </InputWrapper>
            <div className={styles.button_box}>
              <button
                onClick={handleDashboardEditClick}
                disabled={!input.value && prevColor === color}
                className={styles.edit_button}
              >
                변경
              </button>
            </div>
          </div>

          {/* 구성원 */}

          <TablePagination
            row={4}
            data={memberList}
            setData={setMemberList}
            title="구성원"
            tableIndex={{ 이름: "nickname", "": "deleteButton" }}
          />

          {/* 초대 내역 */}

          <TablePagination
            row={4}
            data={invitationList}
            setData={setInvitationList}
            invite
            title="초대 내역"
            tableIndex={{ 이메일: "email", "": "cancelButton" }}
          />

          <Button
            disabled={pending}
            onClick={handleDashboardDeleteModalToggle}
            color="gray"
            buttonType="dashboard_delete"
          >
            대시보드 삭제하기
          </Button>

          {isOpenDashboardDeleteModal && (
            <AlertModal
              alertText="대시보드를 삭제하시겠습니까?"
              handleSubmit={handleDashboardDeleteSubmit}
              handleModalClose={handleDashboardDeleteModalToggle}
            />
          )}
        </div>
      </MenuLayout>
    </>
  );
};

export default DashboardEdit;
