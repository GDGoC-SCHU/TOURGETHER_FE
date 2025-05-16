import { useState } from 'react';
import { Alert } from 'react-native';

// uac8cuc2dcuae00 ud0c0uc785 uc815uc758
export interface Post {
  id: string;
  title: string;
  content?: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  image: any; // uc774ubbf8uc9c0 ub9acuc18cuc2a4 ud0c0uc785
  tags?: string[];
  location?: string;
}

// ub313uae00 ud0c0uc785 uc815uc758
export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  avatar: any;
  likes: number;
}

/**
 * uac8cuc2dcud310 uad00ub828 uae30ub2a5uc744 uad00ub9acud558ub294 ucee4uc2a4ud140 ud6c5
 */
const useBoard = () => {
  // uc0d8ud50c uac8cuc2dcuae00 ub370uc774ud130
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Best spots in Seoul for night views',
      content: 'Seoul has some amazing night views! After exploring the city for a week, here are my top 5 recommendations for the best night views in Seoul:\n\n1. Namsan Tower - A classic spot that offers a panoramic view of the entire city. Best visited after 8 PM.\n\n2. Lotte World Tower Observatory - The highest point in Seoul with glass floors for the brave!\n\n3. Hangang River Park (Banpo) - Beautiful with the rainbow fountain show.\n\n4. Seoullo 7017 - The elevated walkway is lovely at night with all the lights.\n\n5. Naksan Park - Less crowded and offers a different perspective of the city.\n\nDon\'t forget to bring your camera!',
      author: 'traveler_kim',
      date: '2 hours ago',
      likes: 24,
      comments: 8,
      image: require('@/assets/images/seoul.png'),
      tags: ['seoul', 'night view', 'travel tips'],
      location: 'Seoul, South Korea'
    },
    {
      id: '2',
      title: 'Jeju Island: 3-day itinerary guide',
      content: 'Just came back from a wonderful trip to Jeju Island! Here\'s my 3-day itinerary that covers the best of what the island has to offer:\n\nDay 1: East Jeju\n- Sunrise at Seongsan Ilchulbong Peak\n- Visit Udo Island by ferry\n- Lunch at a seafood restaurant near Seongsan Harbor\n- Explore Manjanggul Cave\n- Dinner and relaxation at Hamdeok Beach\n\nDay 2: South Jeju\n- Visit Cheonjiyeon Waterfall\n- Explore Yeomiji Botanical Garden\n- Lunch in Seogwipo City\n- Afternoon at Jungmun Beach\n- Dinner at Black Pork Street\n\nDay 3: West Jeju\n- Morning at Hallim Park\n- Visit O\'sulloc Tea Museum\n- Lunch with a view at a cafe near Hyeopjae Beach\n- Climb Mt. Sanbangsan\n- Watch sunset at Songaksan Mountain\n\nTransportation tip: Rent a car for the most convenient experience, public transportation can be limited.\n\nHope this helps someone planning their Jeju adventure!',
      author: 'adventure_lee',
      date: '5 hours ago',
      likes: 56,
      comments: 12,
      image: require('@/assets/images/jeju.png'),
      tags: ['jeju', 'itinerary', 'travel guide'],
      location: 'Jeju Island, South Korea'
    },
    {
      id: '3',
      title: 'Hidden cafes in Busan you must visit',
      content: 'If you\'re a coffee enthusiast visiting Busan, you can\'t miss these hidden gems!\n\n1. Waveon Coffee - Located right on Gwangalli Beach with floor-to-ceiling windows offering incredible ocean views. Try their signature Gwangan Wave Latte!\n\n2. Brown Hands Cafe - Hidden in Jeonpo Cafe Street, this industrial-style cafe has amazing desserts and unique coffee blends.\n\n3. Cafe Marin - A small boat-themed cafe near Gamcheon Culture Village with panoramic views of the colorful houses.\n\n4. Momos Coffee - Award-winning baristas serve some of the best pour-overs in Korea. Their space is also beautifully designed.\n\n5. Coffee Loft - Located in an old renovated warehouse in Yeongdo, this spacious cafe has a great atmosphere for working or relaxing.\n\nAll these cafes not only serve great coffee but also provide perfect Instagram opportunities!',
      author: 'coffee_lover',
      date: '1 day ago',
      likes: 42,
      comments: 15,
      image: require('@/assets/images/busan.png'),
      tags: ['busan', 'cafe', 'coffee'],
      location: 'Busan, South Korea'
    },
    {
      id: '4',
      title: 'Traditional experiences in Gyeongju you shouldn\'t miss',
      content: 'Known as "the museum without walls," Gyeongju offers so many cultural experiences! Here are the ones I found most memorable:\n\n1. Staying at a traditional Hanok guesthouse near Gyeongju Historic Areas. The sound of raindrops on the tile roof was magical!\n\n2. Tea ceremony at Golgulsa Temple - Learn about traditional Korean tea culture in a serene environment.\n\n3. Try making Gyeongju bread (Hwangnam-ppang) - Many bakeries offer classes where you can make this famous local treat.\n\n4. Dress in Hanbok and visit Donggung Palace and Wolji Pond at sunset - The reflections in the pond are breathtaking.\n\n5. Make your own pottery at the Gyeongju Pottery Village - Create your own souvenir inspired by Silla Dynasty designs.\n\nHave you tried any of these? What was your favorite experience in Gyeongju?',
      author: 'history_buff',
      date: '2 days ago',
      likes: 31,
      comments: 9,
      image: require('@/assets/images/gyeongju.png'),
      tags: ['gyeongju', 'traditional', 'culture'],
      location: 'Gyeongju, South Korea'
    },
    {
      id: '5',
      title: 'Relaxing beach spots in Yeosu for a weekend getaway',
      content: 'Had an amazing weekend in Yeosu! If you\'re looking for relaxation, here are my recommended beaches:\n\n1. Manseongri Beach - Black sand beach with fewer tourists and a peaceful atmosphere. The sunset here is incredible!\n\n2. Mosageum Beach - Crystal clear water perfect for swimming and some snorkeling. There are good facilities including showers and changing rooms.\n\n3. Bangjukpo Beach - Great for families with calm, shallow water. The pine tree forest behind the beach provides nice shade.\n\n4. Sangchon Beach - If you want to avoid crowds completely, this small hidden beach is your best bet.\n\nDon\'t forget to try the fresh seafood at the local restaurants near these beaches! The grilled fish and raw fish dishes were outstanding.\n\nTiming tip: Visit during weekdays if possible, as beaches can get crowded on weekends, especially in summer.',
      author: 'ocean_lover',
      date: '3 days ago',
      likes: 28,
      comments: 6,
      image: require('@/assets/images/yeosu.png'),
      tags: ['yeosu', 'beach', 'weekend'],
      location: 'Yeosu, South Korea'
    },
  ]);

  // uac8cuc2dcubb3c ud544ud130ub9c1 - ud0ad, uac80uc0c9uc5b4 uae30uc900
  const filterPosts = (searchQuery: string, activeTab: string) => {
    return posts.filter(post => {
      // uac80uc0c9uc5b4 ud544ud130
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                            post.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      // ud0ad ud544ud130 - uc778uae30uc21c, ucd5cuc2e0uc21c, ud314ub85cuc789 uae30ub2a5 uad6cud604 uc608uc815
      let matchesTab = true;
      if (activeTab === 'popular') {
        // uc778uae30 uae30uc900 - uc608uc2dc: uc88buc544uc694 uc218 uae30uc900 uc815ub82c
        matchesTab = true; // ud604uc7acub294 ubaa8ub4e0 uac8cuc2dcubb3c ud45cuc2dc
      } else if (activeTab === 'recent') {
        // ucd5cuc2e0uc21c - uc2e4uc81c uad6cud604uc5d0uc11cub294 ub0a0uc9dc uae30uc900 uc815ub82c
        matchesTab = true;
      } else if (activeTab === 'following') {
        // ud314ub85cuc789 - uc2e4uc81c uad6cud604uc5d0uc11cub294 uc720uc800 ud314ub85cuc789 uc815ubcf4 uae30ubc18
        matchesTab = false; // ud504ub85cud1a0ud0c0uc785uc5d0uc11cub294 ud314ub85cuc789 uc0c1ud0dc uad6cud604 uc548 ud568
      }
      
      return matchesSearch && matchesTab;
    });
  };

  // uc0c8 uac8cuc2dcubb3c uc791uc131
  const createNewPost = () => {
    Alert.alert('New Post', 'This feature will be implemented in future updates.');
  };

  // ud2b9uc815 uac8cuc2dcubb3c uc0c1uc138 uc870ud68c
  const getPostDetails = (postId: string): Post | undefined => {
    return posts.find(post => post.id === postId);
  };

  // uc88buc544uc694 uae30ub2a5
  const likePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  // ub313uae00 uac00uc838uc624uae30
  const getComments = (postId: string): Comment[] => {
    // uc0d8ud50c ub313uae00 ub370uc774ud130 - uc2e4uc81cub85cub294 API ud638ucd9c ub4f1uc73cub85c uad6cud604
    const commentsMap: { [key: string]: Comment[] } = {
      '1': [
        {
          id: '1',
          author: 'park_explorer',
          text: 'I visited Namsan Tower last month and the view was breathtaking! Great recommendations.',
          date: '1 hour ago',
          avatar: require('@/assets/images/profile.png'),
          likes: 5
        },
        {
          id: '2',
          author: 'night_photographer',
          text: 'Would you recommend bringing a tripod to these spots? Or is handheld photography good enough?',
          date: '1 hour ago',
          avatar: require('@/assets/images/profile.png'),
          likes: 2
        }
      ],
      '2': [
        {
          id: '1',
          author: 'jeju_fan',
          text: 'Thanks for sharing this itinerary! Did you find 3 days sufficient to explore the island?',
          date: '2 hours ago',
          avatar: require('@/assets/images/profile.png'),
          likes: 3
        }
      ]
      // ub2e4ub978 uac8cuc2dcubb3cuc758 ub313uae00ub3c4 ucd94uac00 uac00ub2a5
    };
    
    return commentsMap[postId] || [];
  };

  // ub313uae00 uc791uc131
  const addComment = (postId: string, commentText: string): Promise<Comment> => {
    return new Promise((resolve) => {
      // uc0c8 ub313uae00 uc0dduc131
      const newComment: Comment = {
        id: Date.now().toString(),
        author: 'me', // uc2e4uc81c uad6cud604uc5d0uc11cub294 ub85cuadf8uc778ud55c uc0acuc6a9uc790 uc815ubcf4ub97c uac00uc838uc640uc57c ud568
        text: commentText,
        date: 'Just now',
        avatar: require('@/assets/images/profile.png'),
        likes: 0
      };

      // uac8cuc2dcubb3cuc758 ub313uae00 uc218 uc5c5ub370uc774ud2b8
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, comments: post.comments + 1 } : post
        )
      );
      
      // uc2e4uc81c uad6cud604uc5d0uc11cub294 API ud638ucd9cuc744 ud1b5ud574 ub313uae00uc744 ub4f1ub85dud558uace0 uc751ub2f5uc744 ubc1buc544uc57c ud568
      setTimeout(() => {
        resolve(newComment);
      }, 500);
    });
  };

  return {
    posts,
    filterPosts,
    createNewPost,
    getPostDetails,
    likePost,
    getComments,
    addComment
  };
};

export default useBoard; 