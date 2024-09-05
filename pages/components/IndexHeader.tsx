import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import styles from "./IndexHeader.module.css";
import sender from "@/apis/sender";
import { useRouter } from "next/router";

interface IndexHeaderProps {
  color: "white" | "black";
}

const IndexHeader = ({ color = "white" }: IndexHeaderProps) => {
  const router = useRouter();

  return (
    <>
      <header
        className={clsx(styles.header, {
          [styles.header__black]: color === "black",
        })}
      >
        <Link className={styles.logo__link} href="/">
          <picture className={styles.logo__picture}>
            <source media="(max-width: 767px)" srcSet={`/images/logo-${color === "white" ? "purple" : "white"}.svg`} />
            <Image
              width={110}
              height={35}
              placeholder="blur"
              blurDataURL={`/images/logo-${color === "white" ? "purple" : "white"}-horizontal.png`}
              src={`/images/logo-${color === "white" ? "purple" : "white"}-horizontal.png`}
              alt="홈페이지로 바로가기"
            />
          </picture>
        </Link>
        <button
          type="button"
          onClick={async (e) => {
            e.preventDefault();

            const signData = {
              email: "test@taskify.com",
              password: "test0486",
            };

            const signinRes = await sender.post({ path: "signin", data: signData });

            if (signinRes.status === 201) {
              document.cookie = `accessToken=${signinRes.data.accessToken}`;
              router.push("/mydashboard");
              return;
            }
          }}
          className={styles.test_link}
        >
          테스트 로그인
        </button>
        <Link className={styles.login__link} href="/signin">
          로그인
        </Link>
        <Link className={styles.signup__link} href="/signup">
          회원가입
        </Link>
      </header>
    </>
  );
};

export default IndexHeader;
