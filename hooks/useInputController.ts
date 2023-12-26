import { Configs } from "@/constants/inputConfig";
import { ChangeEvent, useState } from "react";

function useInputController({ errorConfig, inputConfig, labelConfig }: Configs) {
  const [value, setValue] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [errorText, setErrorText] = useState("");
  const [eyesValue, setEyesValue] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValue(value);
  };

  const onBlur = () => {
    errorConfig?.find((error) => {
      const callback = error[0];
      if ("type" in callback) {
        if (!inputConfig.name) return;
        const res = callback({ name: inputConfig.name, value });

        if (typeof res === "string") {
          setErrorText(res);
        }
        return;
      }
      if (callback(value) && error[1]) {
        setErrorText(error[1]);
      }
    });
  };

  const onFocus = () => {
    if (errorText) {
      setErrorText("");
    }
  };

  const onEyesClick = () => {
    setEyesValue((current) => !current);
  };

  const typeChanger = (type: string | undefined) => {
    if (!type) return "text";
    if (!eyesValue) return type;
    return "text";
  };

  const changedType = typeChanger(inputConfig.type);

  return {
    wrapper: {
      errorText,
      onBlur,
      onFocus,
      htmlFor: inputConfig.id,
      ...labelConfig,
    },
    input: {
      value,
      setValue,
      onChange,
      eyesValue,
      onEyesClick,
      ...inputConfig,
      type: changedType,
    },
    dateTime: { date, setDate, id: inputConfig.id },
    etc: {
      setErrorText,
      setValue,
    },
  };
}

export default useInputController;
