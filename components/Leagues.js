import {
  Alert,
  Button, Modal, Pressable,
  SafeAreaView,
  ScrollView, StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Footer from './Footer';
import {createLeaguePost, getCategoriesForLeague, getLeaugesForUser, joinLeagueByCode} from '../stores/leagueStore';
import MultiSelect from 'react-native-multiple-select';
import DatePicker from 'react-native-date-picker';

export default function Leagues({navigation, route}) {

  const { userId, username } = route.params;
  const [code, setCode] = useState('');
  const [leagueName, setLeagueName] = useState('');
  const [visibleJoin, setVisibleJoin] = useState(false);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [leagues, setLeagues] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [leagueLength, setLeagueLength] = useState(0);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dailyCategories, setDailyCategories] = useState(0);
  const [questionsPerCategory, setQuestionsPerCategory] = useState(0);
  const[joinedLeague, setJoinedLeague] = useState(false);
  const[notJoinedLeague, setNotJoinedLeague] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    getLeaugesForUser(userId).then(res => {
      setLeagues(res);
    });
    getCategoriesForLeague().then(res => {
      setCategories(res.categories);
    });
  }, []);


  const onSelectedItemsChange = (selectedCategories) => {
    setSelectedCategories(selectedCategories);
    console.log(selectedCategories);
  };

  const createLeague = () => {
    const data = {
      leagueName: leagueName,
      leagueAdmin: userId,
      seasonLength: leagueLength,
      startDate: date.toISOString().substr(0,10),
      dailyCategories: dailyCategories,
      questionsPerCategory: questionsPerCategory,
      leagueCategories: selectedCategories,
    };
    console.log(data)
    createLeaguePost(data).then(res => {
      console.log(res);
      setVisibleCreate(false);
      setSelectedCategories([]);
      getLeaugesForUser(userId).then(res => {
        setLeagues(res);
      });
    });
  };

  function handleJoinByCode() {
    if (code) {
      joinLeagueByCode(userId, code).then(res => {
        if(res) {
          getLeaugesForUser(userId).then(res => {
            setLeagues(res);
          });
          setJoinedLeague(true);
          setTimeout(() => setJoinedLeague(false), 3000);
        } else {
          setNotJoinedLeague(true);
          setTimeout(() => setNotJoinedLeague(false), 3000);
        }})
    }
  }

  const handlePress = (categoryId) => {
    if(selectedCategories.includes(categoryId)) {
      const newCategories = selectedCategories.filter((id) => id !== categoryId);
      setSelectedCategories(newCategories)
    } else {
      setSelectedCategories((prevCategories) => [...prevCategories, categoryId]);
    }
  }

  return (
    <View className='flex-1'>
      <ScrollView>
        <View className='flex-1 justify-start items-start m-5'>
          <Text className='text-3xl text-blue-950 mb-5' style={{fontFamily: "ShantellSans-Bold"}}>My leagues</Text>
          {leagues.leagues && leagues.leagues.sort((a, b) => a.leagueId - b.leagueId)
              .map((league, index) => {
            return (
              <TouchableOpacity activeOpacity={0.4}
                                className='border-2 border-gray-300 rounded-2xl p-5 w-full mb-4 flex justify-center items-center'
                                onPress={() => navigation.navigate('League', {leagueId: league.leagueId, userId: userId, username: username})}
                                key={league.leagueId}>
                <Text className='text-lg text-blue-950' style={{fontFamily: "ShantellSans-Bold"}}>{league.leagueName}</Text>
              </TouchableOpacity>
            );
          })}
          <View className='flex-row justify-around items-center my-4 w-full'>
            <TouchableOpacity activeOpacity={0.6}
                              className='bg-blue-300 rounded-md w-2/5 flex items-center justify-center py-3'
                              onPress={() => {
                                setVisibleJoin(!visibleJoin);
                                setVisibleCreate(false);
                              }}>
              <Text className='text-lg text-blue-950' style={{fontFamily: "ShantellSans-Bold"}}>Join league</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.6}
                              className='bg-blue-300 rounded-md w-2/5 flex items-center justify-center py-3'
                              onPress={() => {
                                setVisibleCreate(!visibleCreate);
                                setVisibleJoin(false);
                                setDate(new Date());
                              }}>
              <Text className='text-lg text-blue-950' style={{fontFamily: "ShantellSans-Bold"}}>Create league</Text>
            </TouchableOpacity>
          </View>
          {
            visibleJoin &&
            (<View className='w-full border-2 border-gray-300 rounded-2xl p-3'>
                <Text className='text-blue-950 text-lg mb-2' style={{fontFamily: "ShantellSans-Bold"}}>Provide a code</Text>
                <TextInput onChangeText={setCode} placeholder='Code'
                           className='border-2 border-blue-950 rounded-md h-10 p-2' />
                {joinedLeague && (
                    <Text className='text-green-800 font-bold mb-2'>League joined successfully!</Text>
                )}
                {notJoinedLeague && (
                    <Text className='text-red-800 font-bold text-lg mb-2'>League with that code doesn't exist.</Text>
                )}
                <View className='flex-row w-[100%] justify-center items-center mt-2'>
                  <TouchableOpacity activeOpacity={0.6}
                                    className='w-1/2 bg-blue-300 rounded-md flex items-center justify-center py-3 my-2'
                                    onPress={handleJoinByCode}
                  >
                    <Text className='text-lg text-blue-950' style={{fontFamily: "ShantellSans-Bold"}}>Join</Text>
                  </TouchableOpacity>
                </View>

              </View>)
          }
          {
            visibleCreate ?
              <View className='w-full border-2 border-gray-300 rounded-2xl p-3'>
                <Text className='text-blue-950 text-lg mb-2' style={{fontFamily: "ShantellSans-Bold"}}>Create a new league</Text>
                <Text className='text-blue-800 mb-1 ' style={{fontFamily: "ShantellSans-Bold"}}>Name</Text>
                <TextInput onChangeText={setLeagueName}
                           className='border-2 border-blue-950 rounded-md h-10 p-2 mb-2' />
                <Text className='text-blue-800 mb-1 ' style={{fontFamily: "ShantellSans-Bold"}}>Length</Text>
                <TextInput onChangeText={setLeagueLength} placeholder='(days)'
                           keyboardType='numeric'
                           className='border-2 border-blue-950 rounded-md h-10 p-2 mb-2'
                />
                <Text className='text-blue-800 mb-1 ' style={{fontFamily: "ShantellSans-Bold"}}>Start date</Text>
                <TouchableOpacity
                  className='bg-blue-300 rounded-md w-full flex items-center justify-center py-2'
                  activeOpacity={0.6} onPress={() => setOpen(true)}>
                  <Text className='text-base text-blue-950' style={{fontFamily: "ShantellSans-Bold"}}>Pick a date</Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={open}
                  date={date}
                  onConfirm={(date) => {
                    setOpen(false);
                    setDate(date);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
                <Text className='text-blue-800 mb-1 mt-2' style={{fontFamily: "ShantellSans-Bold"}}>Categories</Text>

                <View className='flex justify-start items-start w-full'>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="bg-blue-600 w-full flex justify-center items-center p-2 rounded-md">
                    <Text className="text-white text-lg" style={{fontFamily: "ShantellSans-Bold"}}>Choose...</Text>
                  </TouchableOpacity>
                </View>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text className="mb-2 text-blue-950 text-lg" style={{fontFamily: "ShantellSans-Bold"}}>Choose categories</Text>
                      {categories && categories.map((category, index) => {
                        return(
                          <Pressable
                            style={{backgroundColor: selectedCategories.includes(category.id) ? "#63E6BE" : "rgb(23 37 84)"}}
                            key={index}
                            onPress={() => handlePress(category.id)}
                            className="w-48 h-12 rounded-xl mb-2 flex justify-center items-center ">
                            <Text className="text-white" style={{fontFamily: "ShantellSans-Bold"}}>{category.name}</Text>
                          </Pressable>
                        )
                      })}
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>Close</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
                <Text className='text-blue-800 mb-1 mt-2' style={{fontFamily: "ShantellSans-Bold"}}>Daily categories</Text>
                <TextInput onChangeText={setDailyCategories}
                           keyboardType='numeric'
                           className='border-2 border-blue-950 rounded-md h-10 p-2 mb-2'
                />
                <Text className='text-blue-800 mb-1 ' style={{fontFamily: "ShantellSans-Bold"}}>Questions per category</Text>
                <TextInput onChangeText={setQuestionsPerCategory}
                           keyboardType='numeric'
                           className='border-2 border-blue-950 rounded-md h-10 p-2 mb-2'
                />
                <TouchableOpacity
                  className='bg-green-300 rounded-md w-full flex items-center justify-center py-2 my-3'
                  activeOpacity={0.6} onPress={() => createLeague()}>
                  <Text className='text-base text-blue-950' style={{fontFamily: "ShantellSans-Bold"}}>Create</Text>
                </TouchableOpacity>
              </View> : <></>
          }
        </View>
      </ScrollView>
      <Footer navigation={navigation} current='leagues' userId={userId} username={username}/>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontFamily: 'ShantellSans-Bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
