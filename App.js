
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


const EXPO_PUBLIC_firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

// Initialize Firebase
const app = initializeApp(EXPO_PUBLIC_firebaseConfig);
const database = getDatabase(app);


ref(database, 'items/')

export default function App() {

  const [ammount, setAmmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      setItems(Object.values(data));
    })
  }, []);

  const saveItem = () => {
    const itemsRef = ref(database, 'items/');
    const newItemsRef = push(itemsRef, {
      'product': product,
      'ammount': ammount
    });

    // Firebase refkey
    const newItemsKey = newItemsRef.key;
    setItems([...items, { product, ammount, key: newItemsKey }]);
    // Nollaa kentät
    setProduct('');
    setAmmount('');
  }
  const deleteItem = (itemKey) => {
    console.log('Deleting item with key:', itemKey);

    // Poista fireBasesta
    remove(ref(database, 'items/' + itemKey))
      .then(() => {
        const updatedItems = items.filter((item) => item.key !== itemKey);
        setItems(updatedItems);
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  }
  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' style={{ marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(product) => setProduct(product)}
        value={product} />
      <TextInput placeholder='ammount' keyboardType="numeric" style={{ marginTop: 5, marginBottom: 5, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(ammount) => setAmmount(ammount)}
        value={ammount} />
      <Button onPress={saveItem} title="Save" />
      <Text style={{ marginTop: 30, fontSize: 20 }}>items</Text>
      <FlatList
        style={{ marginLeft: "5%" }}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <View style={styles.listcontainer}>
            <Text style={{ fontSize: 18 }}>{item.product}, {item.ammount}</Text>
            <Text
              style={{ fontSize: 18, color: '#0000ff' }}
              onPress={() => deleteItem(item.key)}
            >
              Delete
            </Text>
          </View>
        )}
        data={items}
        ItemSeparatorComponent={listSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});
