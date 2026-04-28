import "./Skeleton.scss";

interface Props {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
}

export default function Skeleton({ width = "100%", height = 16, radius = 8, className = "" }: Props) {
  return (
    <div
      className={`sk ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}
