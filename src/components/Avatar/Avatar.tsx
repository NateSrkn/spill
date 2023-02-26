import { getInitials, regexpEmojiPresentation } from "../../utils";
import { cva, type VariantProps } from "class-variance-authority";

const avatar = cva("flex-shrink-0 avatar", {
  variants: {
    colors: {
      tonal: ["tonal"],
      neutral: ["neutral"],
    },
    size: {
      small: ["h-[40px] w-[40px]"],
      large: ["h-[64px] w-[64px]"],
    },
    content: {
      largeEmoji: ["text-4xl"],
      smallEmoji: ["text-2xl"],
      largeText: ["text-2xl"],
      smallText: ["text-sm"],
    },
  },
  defaultVariants: {
    colors: "neutral",
    size: "large",
    content: "smallText",
  },
});

interface AvatarProps extends VariantProps<typeof avatar> {
  name: string;
}

export const Avatar = ({ name, colors, size }: AvatarProps) => {
  const emoji = name.match(regexpEmojiPresentation);
  const initials = getInitials(
    name.replace(regexpEmojiPresentation, "").trim()
  );
  const number = emoji ? parseInt(emoji[0], 10) : null;
  const contentSize = () => {
    if (emoji && !number && size === "large") {
      return "largeEmoji";
    }
    if (emoji && !number) {
      return "smallEmoji";
    }
    if (!emoji && [undefined, "large"].includes(size as any)) {
      return "largeText";
    }
  };

  return (
    <div
      className={avatar({
        size,
        colors,
        content: contentSize(),
      })}
    >
      {emoji ? emoji[0] : null || initials}
    </div>
  );
};

export default Avatar;
