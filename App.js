import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { theme } from './colors';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(()=>{
    loadToDos();
  },[]);

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }catch {
      alert("저장 실패!");
    }    
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);      
      setToDos(JSON.parse(s));
    }catch { 
      alert("불러오기 실패!");
    }    
  };
  const addToDo = async () => {
    if(text === ""){
      return;
    }
    // save to do
    //const newToDos = Object.assign({}, toDos, {[Date.now()]: {text, work:working}});
    //ES6 스프레드 문법으로 오브젝트 합치기⬇️
    const newToDos = {...toDos, [Date.now()]: {text, working}};

    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("정말 삭제할껍니까!!!?","진짜로?!?", [
      { text:"아니요" },
      { 
        text:"네!", 
        onPress: () => {
          const newToDos = {...toDos};
          delete newToDos[key]
          setToDos(newToDos);
          saveToDos(newToDos);
        }
      }
    ]);    
  };
  return (
    <View style={styles.container}>     
      <StatusBar style="auto" color="white"/>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working?  "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working?  "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          returnKeyType='done'
          value={text}
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          placeholder={working? "할 일을 추가해바!" : "어디로 여행갈래?"} style={styles.input}/>
        <ScrollView>
          {Object.keys(toDos).map(key => 
            toDos[key].working === working ?  (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={()=>{deleteToDo(key)}}><Feather name="delete" size={20} color="white" /></TouchableOpacity>                
              </View> 
            ) : null            
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header : {
    justifyContent:"space-between",
    flexDirection: "row",
    marginTop:100,
  },
  btnText:{
    fontSize:40,
    fontWeight:"600",
  },
  input: {
    backgroundColor:"white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 16,
  },
  toDo: {
    backgroundColor:theme.grey,
    marginBottom:10,
    paddingHorizontal:20,
    paddingVertical:20,
    borderRadius: 10,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  },
});
