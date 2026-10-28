import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [nick, setNick] = useState("");

  function iniciarJogo() {
    const nome = nick.trim();
    if (!nome) {
      Alert.alert("Atenção", "Informe seu nickname para começar.");
      return;
    }
    router.push({ pathname: "/jogo", params: { nick: nome } });
  }

  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Adivinhação de Números</Text>
      <Text style={styles.instrucao}>
        Descubra o número sorteado entre 1 e 100. A cada palpite, você receberá uma dica.
      </Text>
      <Text style={styles.label}>Nickname do jogador:</Text>
      <TextInput
        style={styles.input}
        value={nick}
        onChangeText={setNick}
        placeholder="Digite seu nickname"
        maxLength={24}
        autoCapitalize="none"
        returnKeyType="go"
        onSubmitEditing={iniciarJogo}
      />
      <Pressable onPress={iniciarJogo} style={styles.botao}>
        <Text style={styles.textoBotao}>Começar a jogar</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/rank")} style={[styles.botao, styles.botaoSecundario]}>
        <Text style={styles.textoBotao}>Ver ranking</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, justifyContent: "center", padding: 24, gap: 12, backgroundColor: "#f8fafc" },
  titulo: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 8, color: "#1e293b" },
  instrucao: { fontSize: 16, textAlign: "center", color: "#475569", marginBottom: 18, lineHeight: 23 },
  label: { fontSize: 16, fontWeight: "600", color: "#334155" },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, padding: 14, backgroundColor: "#fff", fontSize: 16 },
  botao: { backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 6 },
  botaoSecundario: { backgroundColor: "#475569" },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
