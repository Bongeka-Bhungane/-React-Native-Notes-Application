import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export interface NoteCardProps {
  title: string;
  text: string;
  date?: string;
}

// // Helper function to get "time ago"
// const timeAgo = (date: Date) => {
// //   const now = new Date();
// //   const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

// //   const intervals: { [key: string]: number } = {
// //     year: 31536000,
// //     month: 2592000,
// //     week: 604800,
// //     day: 86400,
// //     hour: 3600,
// //     minute: 60,
// //     second: 1,
// //   };

// //   for (const i in intervals) {
// //     const interval = Math.floor(seconds / intervals[i]);
// //     if (interval >= 1) {
// //       return `${interval} ${i}${interval > 1 ? "s" : ""} ago`;
// //     }
// //   }
// //   return "just now";
// // };

const NoteCard: React.FC<NoteCardProps> = ({ title, text, date }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {text}
      </Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

export default NoteCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
  },
  description: {
    color: '#666', 
    marginBottom: 10,
  },
  date: {
    color: '#999', fontSize: 12,
  },
});