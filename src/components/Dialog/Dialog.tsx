import {
  Root,
  Trigger as DialogTrigger,
  Portal,
  Title,
  Overlay,
  Content,
} from "@radix-ui/react-dialog";
import useWindowSize from "../../hooks/useWindowSize";

import styles from "./Dialog.module.scss";

interface DialogProps {
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: () => void;
  children: React.ReactNode;
  title?: string;
}
const Dialog = ({
  trigger: Trigger,
  open,
  onOpenChange,
  children,
  title,
}: DialogProps) => {
  const { height, width } = useWindowSize();
  const dialogPosition =
    width > 768
      ? {}
      : ({
          "--position": `${height}px`,
        } as React.CSSProperties);
  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <Portal>
        <Overlay className={styles.overlay} />
        <Content className={styles.content} style={dialogPosition}>
          {children}
        </Content>
      </Portal>
    </Root>
  );
};

export default Dialog;
