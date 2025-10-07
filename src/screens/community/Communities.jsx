import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getApprovedCommunities } from "../../redux/actions/communityAction";
import { clearMessage } from "../../redux/slices/communitySlice";
import { communitiesStyles as styles } from "../../styles/CommunitiesStyles";


const Communities = ({ navigation }) => {
  const dispatch = useDispatch();
  const { communities, loading, error, message, success } = useSelector(
    (state) => state.communities
  );

  const [refreshing, setRefreshing] = useState(false);
console.log("communities", communities);
  useEffect(() => {
    dispatch(getApprovedCommunities());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getApprovedCommunities()).finally(() => setRefreshing(false));
    dispatch(clearMessage());
  };

  useEffect(() => {
    if (success) {
      dispatch(getApprovedCommunities());
      dispatch(clearMessage());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (message) {
      Alert.alert("Success", message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      
    </View>
  );
};

export default Communities;