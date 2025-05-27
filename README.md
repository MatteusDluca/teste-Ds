943055165573-ltg29ommg2017di9deeurhvu0q16nsb8.apps.googleusercontent.com
Google CLoud Id: 123594945191-vfcr37gs3aia1ag7k8qb7hdv6b28eef1.apps.googleusercontent.com

/_ eslint-disable react-hooks/exhaustive-deps _/
// app/index.tsx
import _ as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import _ as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import api from '../src/services/api';
import { getSavedEmail, initDB, saveEmail } from '../src/storage/sqlite';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
const [email, setEmail] = useState('');
const router = useRouter();

// Configuração do provedor Google (fluxo web)
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
androidClientId:
'943055165573-q2mnqb6koq77mrbmg4me5hhereobrc6l.apps.googleusercontent.com', // Android OAuth Client ID do GCP
});

// Inicializa o DB e redireciona se já tiver e-mail salvo
useEffect(() => {
initDB();
const saved = getSavedEmail();
if (saved) {
router.replace({ pathname: '/home', params: { email: saved } });
}
}, []);

// Trata resposta do Google
useEffect(() => {
if (response?.type === 'success' && response.params.id_token) {
const idToken = response.params.id_token;
// Valida e extrai email direto da API Google
fetch(
`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`
)
.then((res) => res.json())
.then((data) => {
const userEmail = data.email as string;
setEmail(userEmail);
// envia confirmação e salva offline
api.post('/send-confirm', { email: userEmail });
saveEmail(userEmail);
router.replace({ pathname: '/home', params: { email: userEmail } });
})
.catch((err) => Alert.alert('Erro validação', err.message));
}
}, [response]);

// Login por e-mail
const handleEmailLogin = async () => {
if (!email.trim()) return Alert.alert('Erro', 'Informe um e-mail válido.');
try {
await api.post('/send-confirm', { email });
saveEmail(email);
router.replace({ pathname: '/home', params: { email } });
} catch {
Alert.alert('Erro', 'Falha ao enviar e-mail.');
}
};

return (
<View style={styles.container}>
<TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
<Button title="Enviar e-mail" onPress={handleEmailLogin} />
<View style={{ height: 10 }} />
<Button
title="Conectar com Google"
disabled={!request}
onPress={() => promptAsync()}
/>
</View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, padding: 20, justifyContent: 'center' },
input: { borderBottomWidth: 1, marginBottom: 20, height: 40, fontSize: 16 },
});
