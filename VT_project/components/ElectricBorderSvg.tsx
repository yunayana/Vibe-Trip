import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  children: React.ReactNode;
  borderRadius?: number;
  strokeColor?: string;
  glowColor?: string;
  strokeWidth?: number;
  padding?: number;
};

type Point = { x: number; y: number };

export default function ElectricBorderSvg({
  children,
  borderRadius = 40,
  strokeColor = '#EAFBFF',
  glowColor = '#B8F6FF',
  strokeWidth = 1.4,
  padding = 10,
}: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [pathD, setPathD] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const innerRadius = Math.max(borderRadius - padding / 2, 8);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const randomOffset = (amount: number) => (Math.random() - 0.5) * amount;

  const buildElectricPath = useMemo(() => {
    return (width: number, height: number) => {
      if (!width || !height) return '';

      const inset = strokeWidth * 2 + 2;
      const left = inset;
      const top = inset;
      const right = width - inset;
      const bottom = height - inset;
      const r = Math.min(innerRadius, width / 6, height / 6);

      const points: Point[] = [];

      const pushSegment = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        steps: number,
        jitter: number,
        skipEnds = false
      ) => {
        for (let i = 0; i <= steps; i++) {
          if (skipEnds && (i === 0 || i === steps)) continue;
          const t = i / steps;
          const x = x1 + (x2 - x1) * t;
          const y = y1 + (y2 - y1) * t;

          const horizontal = Math.abs(y2 - y1) < 1;
          points.push({
            x: horizontal ? x : x + randomOffset(jitter),
            y: horizontal ? y + randomOffset(jitter) : y,
          });
        }
      };

      points.push({ x: left + r, y: top });

      pushSegment(left + r, top, right - r, top, 18, 4.5, true);
      points.push({ x: right - r / 2, y: top + r / 6 });
      points.push({ x: right, y: top + r });

      pushSegment(right, top + r, right, bottom - r, 24, 5.5, true);
      points.push({ x: right - r / 6, y: bottom - r / 2 });
      points.push({ x: right - r, y: bottom });

      pushSegment(right - r, bottom, left + r, bottom, 18, 4.5, true);
      points.push({ x: left + r / 2, y: bottom - r / 6 });
      points.push({ x: left, y: bottom - r });

      pushSegment(left, bottom - r, left, top + r, 24, 5.5, true);
      points.push({ x: left + r / 6, y: top + r / 2 });
      points.push({ x: left + r, y: top });

      if (!points.length) return '';

      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i].x} ${points[i].y}`;
      }
      d += ' Z';
      return d;
    };
  }, [innerRadius, strokeWidth]);

  useEffect(() => {
    if (!size.width || !size.height) return;

    const updatePath = () => {
      setPathD(buildElectricPath(size.width, size.height));
    };

    updatePath();

    intervalRef.current = setInterval(updatePath, 120);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [size, buildElectricPath]);

  return (
    <View style={[styles.wrapper, { borderRadius }]} onLayout={onLayout}>
      {size.width > 0 && size.height > 0 && pathD ? (
        <Svg
          width={size.width}
          height={size.height}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Path
            d={pathD}
            fill="none"
            stroke={glowColor}
            strokeWidth={8}
            strokeOpacity={0.06}
          />
          <Path
            d={pathD}
            fill="none"
            stroke={glowColor}
            strokeWidth={4}
            strokeOpacity={0.18}
          />
          <Path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeOpacity={0.95}
          />
        </Svg>
      ) : null}

      <View
        style={[
          styles.inner,
          {
            margin: padding,
            borderRadius: Math.max(borderRadius - padding, 8),
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  inner: {
    backgroundColor: '#0B0B0C',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 20,
  },
});