import { Color } from "@/lib/types";

type ColorWheelProps = {
  colors: Partial<Color>[];
  size: number; // Size of the circle in pixels
};

const ColorWheel: React.FC<ColorWheelProps> = ({ colors, size }) => {
  const numColors = colors.length;
  const radius = size / 2;

  // SINGLE COLOR → draw a circle
  if (numColors === 1) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shadow-sm rounded-full"
      >
        <circle
          cx={radius}
          cy={radius}
          r={radius}
          fill={colors[0].name}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
    );
  }

  const sliceAngle = 360 / numColors;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shadow-sm rounded-full"
    >
      {colors.map((color, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = radius + radius * Math.cos(startRad);
        const y1 = radius + radius * Math.sin(startRad);
        const x2 = radius + radius * Math.cos(endRad);
        const y2 = radius + radius * Math.sin(endRad);

        const largeArcFlag = sliceAngle > 180 ? 1 : 0;

        return (
          <path
            key={index}
            d={`
              M ${radius},${radius}
              L ${x1},${y1}
              A ${radius},${radius} 0 ${largeArcFlag} 0 ${x2},${y2}
              Z
            `}
            fill={color.name}
            stroke="white"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
};


export default ColorWheel;