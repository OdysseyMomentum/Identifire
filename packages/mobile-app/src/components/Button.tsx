import { TouchableOpacity, StyleSheet } from 'react-native';

const Button = ({
  color,
  text,
  onPress,
}: {
  color: string;
  text: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      {text}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {},
});

export default Button;
