import { Tooltip } from "@heroui/tooltip";
function CellWithTooltip({ text }: { text?: string }) {
  if (!text) return "—";

  return (
    <Tooltip content={text} showArrow placement="top">
      <span className="truncate inline-block max-w-full">{text}</span>
    </Tooltip>
  );
}

export default CellWithTooltip;