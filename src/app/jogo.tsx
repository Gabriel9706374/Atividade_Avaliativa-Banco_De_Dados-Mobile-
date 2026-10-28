import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../../firebaseConfig";

export default function Jogo() {
  const router = useRouter();
  const params = useLocalSearchParams<{ nick?: string }>();
  const nick = typeof params.nick === "string" && params.nick.trim() ? params.nick.trim() : "Jogador";
  const [numeroSorteado] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [palpite, setPalpite] = useState("");
  const [tentativas, setTentativas] = useState(0);
  const [dica, setDica] = useState("Digite um número de 1 a 100 e confirme.");
  const [corDica, setCorDica] = useState("#334155");
  const [finalizado, setFinalizado] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function salvarResultado(totalTentativas: number) {
    setSalvando(true);
    try {
      await addDoc(collection(db, "resultados"), {
        nickname: nick,
        tentativas: totalTentativas,
        numeroSorteado,
        venceu: true,
        criadoEm: serverTimestamp(),
      });
    } catch (erro) {
      Alert.alert("Aviso", "Você venceu, mas não foi possível salvar o resultado no Firebase. Verifique a conexão e as regras do Firestore.");
    } finally {
      setSalvando(false);
    }
  }

  function confirmar() {
    if (finalizado) return;
    const valor = Number(palpite.trim());
    if (!palpite.trim() || !Number.isInteger(valor) || valor < 1 || valor > 100) {
      Alert.alert("Palpite inválido", "Digite um número inteiro entre 1 e 100.");
      return;
    }

    const total = tentativas + 1;
    setTentativas(total);
    setPalpite("");

    if (valor === numeroSorteado) {
      setDica(`Parabéns, ${nick}! Você acertou o número ${numeroSorteado} em ${total} tentativa(s).`);
      setCorDica("#15803d");
      setFinalizado(true);
      void salvarResultado(total);
    } else if (numeroSorteado > valor) {
      setDica("O número sorteado é MAIOR que seu palpite. Tente novamente!");
      setCorDica("#15803d");
    } else {
      setDica("O número sorteado é MENOR que seu palpite. Tente novamente!");
      setCorDica("#dc2626");
    }
  }

  function novoJogo() {
    router.replace({ pathname: "/jogo", params: { nick, novaPartida: String(Date.now()) } });
  }

  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Jogo de Adivinhação</Text>
      <Text style={styles.jogador}>Jogador: {nick}</Text>
      <Text style={styles.instrucao}>Estou pensando em um número entre 1 e 100.</Text>
      <Text style={styles.label}>Seu palpite:</Text>
      <TextInput
        style={styles.input}
        value={palpite}
        onChangeText={setPalpite}
        placeholder="Número de 1 a 100"
        keyboardType="number-pad"
        editable={!finalizado}
        onSubmitEditing={confirmar}
        returnKeyType="done"
      />
      <Pressable onPress={confirmar} disabled={finalizado} style={[styles.botao, finalizado && styles.botaoDesativado]}>
        <Text style={styles.textoBotao}>Confirmar palpite</Text>
      </Pressable>
      <Text style={[styles.dica, { color: corDica }]}>{dica}</Text>
      <Text style={styles.contador}>Tentativas: {tentativas}</Text>
      {finalizado && (
        <>
          <Text style={styles.salvamento}>{salvando ? "Salvando resultado..." : "Resultado enviado para o ranking."}</Text>
          <Pressable onPress={novoJogo} style={[styles.botao, styles.botaoNovo]}>
            <Text style={styles.textoBotao}>Jogar novamente</Text>
          </Pressable>
          <Pressable onPress={() => router.replace("/")} style={[styles.botao, styles.botaoSecundario]}>
            <Text style={styles.textoBotao}>Voltar ao início</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, padding: 24, justifyContent: "center", gap: 12, backgroundColor: "#f8fafc" },
  titulo: { fontSize: 27, fontWeight: "bold", textAlign: "center", color: "#1e293b", marginBottom: 8 },
  jogador: { textAlign: "center", fontSize: 17, fontWeight: "600", color: "#334155" },
  instrucao: { textAlign: "center", fontSize: 16, color: "#475569", marginBottom: 14 },
  label: { fontWeight: "600", fontSize: 16, color: "#334155" },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, padding: 14, backgroundColor: "#fff", fontSize: 18 },
  botao: { backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center" },
  botaoDesativado: { opacity: 0.5 },
  botaoNovo: { backgroundColor: "#15803d" },
  botaoSecundario: { backgroundColor: "#475569" },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  dica: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 12, lineHeight: 26 },
  contador: { textAlign: "center", fontSize: 16, color: "#334155" },
  salvamento: { textAlign: "center", color: "#475569" },
});
