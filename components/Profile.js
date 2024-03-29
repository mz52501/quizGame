import {Text, View, StyleSheet, Image, ScrollView, Pressable} from 'react-native';
import Footer from './Footer';
import LinearGradient from 'react-native-linear-gradient';
import {useEffect, useState} from 'react';
import {getHomePageData} from '../stores/homeStore';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFont5 from 'react-native-vector-icons/FontAwesome5';
import IconFont6 from 'react-native-vector-icons/FontAwesome6';
import { useIsFocused } from '@react-navigation/native'

export default function Profile({navigation, route}) {

  const { userId, username } = route.params;
  const isFocused = useIsFocused()
  const categoryIcons = {
    History: 'book-open',
    Music: 'music',
    Sport: 'trophy',
    Art: 'palette',
    Geography: 'globe-americas',
    Movies: 'film',
    Science: 'bacteria',
    Food: 'drumstick-bite',
    Technology: 'robot',
    Pop: 'tv'
  };

  const [data, setData] = useState({});

  function fetchData(id) {
    fetch('https://mega-mind-backend-2fe25339801f.herokuapp.com/user/' + id + '/profile')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    if(isFocused){
      fetchData(userId);
    }
  }, [isFocused])

/*  useEffect(() => {
    fetchData(userId);
  }, [userId]);*/

  return (
    <View className='flex-1'>
      <View className='flex-1 justify-start items-center'>
        <LinearGradient
          colors={['rgb(30 64 175)', 'rgb(23 37 84)']}
          useAngle={true} angle={45} angleCenter={{x: 0.2, y: 0.5}}
          className='flex items-center justify-start h-1/4 w-full'>
          <Text className='text-white text-4xl mt-6' style={{fontFamily: "ShantellSans-Bold"}}>Profile</Text>
        </LinearGradient>

        <View className='flex w-full p-5 bg-white rounded-3xl items-center absolute top-32 bottom-0'>
          <Text className='text-blue-950 text-xl mt-12 mb-2' style={{fontFamily: "ShantellSans-Bold"}}>{data.firstname + ' ' + data.lastname}</Text>
          <Text className='text-blue-800 mb-5' style={{fontFamily: "ShantellSans-Regular"}}>@{data.userName}</Text>
          <View className='flex flex-row w-full justify-between flex-wrap'>

            <View className="border-2 border-gray-200 rounded-xl flex items-center px-3 py-5" style={styles.container}>
              <IconFont6
                name='ranking-star'
                size={36}
                color='#A0522D'
              />
              <Text className="text-blue-950 text-lg mt-2 mb-1" style={{fontFamily: "ShantellSans-Bold"}}>#{data.globalLeagueRank}</Text>
              <Text className="text-blue-800" style={{fontFamily: "ShantellSans-Regular"}}>World rank</Text>
            </View>

            <View className='border-2 border-gray-200 rounded-xl flex items-center px-3 py-5' style={styles.container}>
              <IconAnt
                name='star'
                size={36}
                color='#FFDB58'
              />
              <Text className='text-blue-950 text-lg mt-2 mb-1' style={{fontFamily: "ShantellSans-Bold"}}>#{data.level}</Text>
              <Text className='text-blue-800' style={{fontFamily: "ShantellSans-Regular"}}>Level</Text>
            </View>

            <View className='border-2 border-gray-200 rounded-xl flex items-center px-3 py-5' style={styles.container}>
              <IconFont5
                name='gem'
                size={36}
                color='purple'
              />
              <Text className='text-blue-950 text-lg mt-2 mb-1' style={{fontFamily: "ShantellSans-Bold"}}>#{data.userXp}</Text>
              <Text className='text-blue-800' style={{fontFamily: "ShantellSans-Regular"}}>Experience</Text>
            </View>

            <View className='border-2 border-gray-200 rounded-xl flex items-center px-3 py-5 mt-3'
                  style={styles.container}>
              <IconFont5
                name='gamepad'
                size={36}
                color='#FFDEAD'
              />
              <Text className='text-blue-950 text-lg mt-2 mb-1' style={{fontFamily: "ShantellSans-Bold"}}>#{data.answeredQuestions}</Text>
              <Text className='text-blue-800' style={{fontFamily: "ShantellSans-Regular"}}>Answered</Text>
            </View>

            <View className='border-2 border-gray-200 rounded-xl flex items-center px-3 py-5 mt-3'
                  style={styles.container}>
              <IconFont5
                name='check-square'
                size={36}
                color='green'
              />
              <Text
                className='text-blue-950 text-lg mt-2 mb-1' style={{fontFamily: "ShantellSans-Bold"}}>#{data.answeredQuestions ? Math.round((data.answeredCorrect / data.answeredQuestions) * 100) : 0}%</Text>
              <Text className='text-blue-800' style={{fontFamily: "ShantellSans-Regular"}}>Correct</Text>
            </View>

            <View className='border-2 border-gray-200 rounded-xl flex items-center px-3 py-5 mt-3'
                  style={styles.container}>
              <IconAnt
                name='closesquareo'
                size={36}
                color='red'
              />
              <Text
                className='text-blue-950 text-lg mt-2 mb-1' style={{fontFamily: "ShantellSans-Bold"}}>#{data.answeredQuestions ? Math.round(((data.answeredQuestions - data.answeredCorrect) / data.answeredQuestions) * 100) : 0}%</Text>
              <Text className='text-blue-800' style={{fontFamily: "ShantellSans-Regular"}}>Incorrect</Text>
            </View>

          </View>

          <Text className='text-blue-950 text-lg m-5' style={{fontFamily: "ShantellSans-Bold"}}>Accuracy by category</Text>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {data.categories && data.categories.map((category, index) => {
                  return(
                  <View className="border-2 border-gray-300 rounded-full items-center justify-center w-20  mr-2"
                        key={index}>
                    <IconFont5
                      name={categoryIcons[category.categoryName]}
                      size={20}
                      color="rgb(23 37 84)"
                    />
                    <Text className="text-blue-800 text-xs" style={{fontFamily: "ShantellSans-Regular"}}>{category.categoryName.substr(0, 7)}</Text>
                    <Text className="text-blue-800 text-xs" style={{fontFamily: "ShantellSans-Regular"}}>{category.answerPercentage ? Math.round(category.answerPercentage * 100) : 0}%</Text>
                  </View>)
            })}
          </ScrollView>

        </View>
        <View className="absolute top-20 bg-white p-1 rounded-full">
          <Image
            source={require('../public/icons/head_3.png')}
            className='w-24 h-24 rounded-full'
          />
        </View>
      </View>
      <Footer navigation={navigation} current='profile' userId={userId} username={username} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '31%',
  },
});


