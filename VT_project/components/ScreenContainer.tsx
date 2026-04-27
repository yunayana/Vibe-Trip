import { ReactNode } from "react";
import { View } from "react-native";

type Props = {
  children: ReactNode;
};

export default function ScreenContainer({ children }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: "#F7F8FA", paddingHorizontal: 24, paddingTop: 64, paddingBottom: 96 }}>
      {children}
    </View>
  );
}