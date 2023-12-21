import Image from "next/image";
import React from "react";
import styles from "./ArrowButton.module.css";
import { clsx } from "clsx";

interface Props {
  disabled?: boolean;
  onClick?: () => void;
  right?: boolean;
}

const ArrowButton = ({ disabled = false, right = false, onClick }: Props) => {
  const buttonStyle = clsx(styles.button, right && styles.rotate);

  return (
    <button className={clsx(buttonStyle)} onClick={onClick}>
      <div className={styles.icon_wrapper}>
        <Image
          className={clsx(disabled && styles.disabled)}
          alt={`${right ? "오른쪽" : "왼쪽"} 화살표`}
          fill
          src="/images/icons/arrow.svg"
        />
      </div>
    </button>
  );
};

export default ArrowButton;
