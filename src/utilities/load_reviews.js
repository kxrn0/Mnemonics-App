import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore, orderBy } from "firebase/firestore";

export default async function load_reviews(setId) {
  const userId = getAuth().currentUser.uid;
  const reviewsCollection = collection(
    getFirestore(),
    `users/${userId}/sets/${setId}/reviews`,
    orderBy("timestamp", "desc")
  );
  const reviewDocs = await getDocs(reviewsCollection);
  const reviews = [];

  reviewDocs.forEach((doc) => reviews.push(doc.data()));
  return reviews;
}
