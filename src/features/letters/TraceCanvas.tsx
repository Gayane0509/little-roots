/* eslint-disable react-hooks/refs -- PanResponder owns the mutable in-progress stroke; version state triggers SVG redraws. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

import { BigButton } from '@/ui/BigButton';
import { colors, radius, spacing } from '@/ui/tokens';
import type { TraceStroke } from './tracing';
import { traceScore } from './tracing';

interface Props {
  upper: string; lower: string;
  onDone: (score: number) => void;
  onDrawingChange?: (drawing: boolean) => void;
  onEdit?: () => void;
}

function pathFor(points: TraceStroke): string {
  if (!points.length) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y} l 0.01 0`;
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1];
    const current = points[i];
    path += ` Q ${previous.x} ${previous.y} ${(previous.x + current.x) / 2} ${(previous.y + current.y) / 2}`;
  }
  const last = points[points.length - 1];
  return `${path} L ${last.x} ${last.y}`;
}

export function TraceCanvas(props: Props) {
  const { width } = useWindowDimensions();
  const size = Math.min(width - spacing.lg * 2 - 4, 356);
  return <TraceCanvasInner key={size} size={size} {...props} />;
}

function TraceCanvasInner({ size, upper, lower, onDone, onDrawingChange, onEdit }: Props & { size: number }) {
  const [useUpper, setUseUpper] = useState(true);
  const [finished, setFinished] = useState<TraceStroke[]>([]);
  const [version, setVersion] = useState(0);
  const active = useRef<TraceStroke>([]);
  const drawingChange = useRef(onDrawingChange);
  const edit = useRef(onEdit);
  const finishedPaths = useMemo(() => finished.map(pathFor), [finished]);
  const clear = () => { active.current = []; setFinished([]); setVersion((v) => v + 1); edit.current?.(); };
  useEffect(() => { drawingChange.current = onDrawingChange; edit.current = onEdit; }, [onDrawingChange, onEdit]);
  useEffect(() => () => drawingChange.current?.(false), []);
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponderCapture: () => true,
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (event) => {
      const { locationX: x, locationY: y } = event.nativeEvent;
      active.current = [{ x, y }];
      setVersion((v) => v + 1);
      drawingChange.current?.(true);
      edit.current?.();
    },
    onPanResponderMove: (event) => {
      const { locationX: x, locationY: y } = event.nativeEvent;
      const previous = active.current[active.current.length - 1];
      if (!previous || Math.hypot(x - previous.x, y - previous.y) < 2) return;
      active.current.push({ x, y });
      setVersion((v) => v + 1);
    },
    onPanResponderRelease: () => {
      const completed = active.current;
      if (completed.length) setFinished((strokes) => [...strokes, completed]);
      active.current = [];
      setVersion((v) => v + 1);
      drawingChange.current?.(false);
    },
    onPanResponderTerminate: () => {
      active.current = [];
      setVersion((v) => v + 1);
      drawingChange.current?.(false);
    },
  }), []);
  const activePath = version >= 0 ? pathFor(active.current) : '';
  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>Follow the letter with your finger</Text>
      <View style={styles.actions}>
        <BigButton label="Uppercase" onPress={() => { setUseUpper(true); clear(); }} color={useUpper ? colors.primary : colors.textMuted} style={styles.toggle} />
        <BigButton label="Lowercase" onPress={() => { setUseUpper(false); clear(); }} color={!useUpper ? colors.primary : colors.textMuted} style={styles.toggle} />
      </View>
      <View style={[styles.frame, { width: size + 4, height: size + 4 }]}>
        <View style={{ width: size, height: size }} accessible accessibilityRole="image" accessibilityLabel={`Trace ${useUpper ? 'uppercase' : 'lowercase'} ${upper}`} accessibilityHint="Drawing area. Follow the faint letter with your finger." {...responder.panHandlers}>
          <Svg width={size} height={size} pointerEvents="none">
            <SvgText x={size / 2} y={size * 0.5 + size * 0.7 * (useUpper ? 0.35 : 0.15)} fontSize={size * 0.7} fontWeight="bold" fill="#D7D9DF" textAnchor="middle">{useUpper ? upper : lower}</SvgText>
            {finishedPaths.map((path, index) => <Path key={index} d={path} fill="none" stroke={colors.primary} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />)}
            {activePath ? <Path d={activePath} fill="none" stroke={colors.primary} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /> : null}
          </Svg>
        </View>
      </View>
      <View style={styles.actions}>
        <BigButton label="Clear" onPress={clear} color={colors.textMuted} style={styles.toggle} />
        <BigButton label="Done" onPress={() => onDone(traceScore([...finished, active.current], size))} style={styles.toggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.md },
  prompt: { color: colors.text, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  actions: { flexDirection: 'row', gap: spacing.sm, width: '100%' },
  toggle: { flex: 1, paddingHorizontal: spacing.sm },
  frame: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border, overflow: 'hidden' },
});
