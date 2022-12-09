import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default async function get_categories_settings() {
  const userId = getAuth().currentUser.uid;
  const categoriesCollection = collection(
    getFirestore(),
    `users/${userId}/categories_settings`
  );
  const catDocs = await getDocs(categoriesCollection);
  const cats = [];

  catDocs.forEach((cat) => cats.push(cat.data()));
  return cats;
}
