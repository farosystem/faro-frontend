import { ButtonHTMLAttributes } from 'react';

type ButtonIconTableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: string;
  color?: string;
};

const ButtonIconTable = ({ icon = '', color = 'primary', ...rest }: ButtonIconTableProps) => {
  return (
    <button
      type="button"
      className={`btn btn-rounded btn-${color} waves-effect waves-light me-3`}
      {...rest}
    >
      <i className={icon}></i>
    </button>
  );
};

export default ButtonIconTable;
