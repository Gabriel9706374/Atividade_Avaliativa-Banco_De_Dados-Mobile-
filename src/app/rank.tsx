import { useFocusEffect, useRouter } from "expo-router";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { db } from "../../firebaseConfig";

type Resultado = {
  id: string;
  nickname: string;
  tentativas: number;
  criadoEm?: { seconds?: number };
};

export default function Rank() {
  const router = useRouter();
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarRanking = useCallback(async () => {
    setCarregando(true);
    try {
      const consulta = query(collection(db, "resultados"), orderBy("tentativas", "asc"), limit(50));
      const snapshot = await getDocs(consulta);
      const lista = snapshot.docs.map((item) => {
        const dados = item.data();
        return {
          id: item.id,
          nickname: typeof dados.nickname === "string" ? dados.nickname : "Jogador",
          tentativas: Number(dados.tentativas) || 0,
          criadoEm: dados.criadoEm,
        };
      });
      setResultados(lista);
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível carregar o ranking. Confira a conexão e as regras do Firestore.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void carregarRanking(); }, [carregarRanking]));

  return (
    <ScrollView contentContainerStyle={styles.tela}>
      <Text style={styles.titulo}>Ranking dos jogadores</Text>
      <Text style={styles.subtitulo}>Os melhores resultados são os que tiveram menos tentativas.</Text>
      {carregando ? <ActivityIndicator size="large" color="#2563eb" /> : resultados.length === 0 ? (
        <Text style={styles.vazio}>Ainda não há resultados. Seja o primeiro a jogar!</Text>
      ) : resultados.map((item, indice) => (
        <View key={item.id} style={styles.linha}>
          <Text style={styles.posicao}>{indice + 1}º</Text>
          <View style={styles.dados}>
            <Text style={styles.nick}>{item.nickname}</Text>
            <Text style={styles.tentativas}>{item.tentativas} tentativa(s)</Text>
          </View>
        </View>
      ))}
      <Pressable onPress={() => void carregarRanking()} style={styles.botao}>
        <Text style={styles.textoBotao}>Atualizar ranking</Text>
      </Pressable>
      <Pressable onPress={() => router.replace("/")} style={[styles.botao, styles.secundario]}>
        <Text style={styles.textoBotao}>Voltar ao início</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flexGrow: 1, padding: 22, gap: 12, backgroundColor: "#f8fafc" },
  titulo: { fontSize: 27, fontWeight: "bold", textAlign: "center", color: "#1e293b" },
  subtitulo: { textAlign: "center", color: "#475569", marginBottom: 12, lineHeight: 22 },
  vazio: { textAlign: "center", color: "#64748b", padding: 24 },
  linha: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, padding: 14, borderWidth: 1, borderColor: "#e2e8f0" },
  posicao: { width: 48, fontSize: 20, fontWeight: "bold", color: "#2563eb" },
  dados: { flex: 1, gap: 3 },
  nick: { fontSize: 17, fontWeight: "bold", color: "#1e293b" },
  tentativas: { color: "#64748b" },
  botao: { backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 8 },
  secundario: { backgroundColor: "#475569" },
  textoBotao: { color: "#fff", fontWeight: "bold" },
});
