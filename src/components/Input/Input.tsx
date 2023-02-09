import classNames from "classnames";
import {
  type ChangeEventHandler,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
  type HTMLInputTypeAttribute,
} from "react";
import style from "./Input.module.scss";
export const Input = ({
  type = "text",
  asCurrency = false,
  changeOnFocus = true,
  name,
  value,
  handleChange,
  ...rest
}: {
  type?: HTMLInputTypeAttribute;
  asCurrency?: boolean;
  changeOnFocus?: boolean;
  handleChange: (name: any, value: any) => void;
} & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    handleChange(event.currentTarget.name, event.currentTarget.value);
  };

  const handleCurrencyInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { currentTarget } = event;
    let value = currentTarget.value.replace(/\D*/gm, "").replace(/^0+/gm, "");
    value = (Number(value) / 100).toFixed(2);
    currentTarget.value = value;
    handleChange(currentTarget.name, Number(value));
  };

  const moveUserSelect = (event: any) => {
    const { currentTarget } = event;
    if (!currentTarget) return;
    const length = currentTarget.value.length;
    currentTarget.setSelectionRange(length, length);
  };
  const className = classNames(style.base, rest.className, {
    "focus:text-black text-slate-400": changeOnFocus,
  });
  return (
    <>
      {asCurrency ? (
        <div className={style.currency}>
          <input
            value={value === 0 ? "0.00" : Number(value).toFixed(2)}
            className={className}
            name={name}
            type="text"
            inputMode="numeric"
            placeholder="0.00"
            onChange={handleCurrencyInput}
            onClick={moveUserSelect}
            onFocus={moveUserSelect}
          />
          <i>$</i>
        </div>
      ) : (
        <input
          type={type}
          className={className}
          name={name}
          onChange={onChange}
          value={value}
          onFocus={(event) => event.target.select()}
        />
      )}
    </>
  );
};
