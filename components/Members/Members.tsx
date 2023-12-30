import { BasicUserType } from "@/types/api.type";
import styles from "./Members.module.css";
import Profile from "./Profile";

interface MembersProps {
  members: BasicUserType[];
}

const Members = ({ members }: MembersProps) => {
  return (
    <div className={styles.container}>
      {members.slice(0, 4).map((member, idx) => (
        <Profile key={member.id} member={member} idx={idx} />
      ))}
      <Profile member={members} />
    </div>
  );
};
export default Members;
