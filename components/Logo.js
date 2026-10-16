import React from 'react';
import { View, Text, Image } from 'react-native';
import { IMG } from '../images';

export default function Logo({ size = 44, showText = true }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image source={{ uri: IMG.logo }} style={{ width: size, height: size }} resizeMode="contain" />
      {showText && (
        <Text style={{ color: '#fff', fontSize: size * 0.72, fontWeight: '800', marginLeft: 10 }}>Playnex</Text>
      )}
    </View>
  );
}