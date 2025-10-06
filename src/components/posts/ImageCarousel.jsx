import React, { useState, useRef } from "react";
import { View, Image, FlatList } from "react-native";
import { postDetailStyles as styles } from "../../styles/PostDetailStyles";

const ImageCarousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderImage = ({ item }) => (
    <View style={styles.imageSlide}>
      <Image
        source={{ uri: item.url }}
        style={styles.postImage}
        resizeMode="cover"
      />
    </View>
  );

  const renderImageIndicators = () => {
    if (!images || images.length <= 1) return null;

    return (
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentImageIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    );
  };

  if (!images || images.length === 0) return null;

  return (
    <View style={styles.imageSection}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImage}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      {renderImageIndicators()}
    </View>
  );
};

export default ImageCarousel;