import React from "react";
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer'
import styled from 'styled-components/native';


const CustomDrawer = (props) => {
  return (
  <Container>
    <DrawerContentScrollView {...props}>
      <LogoImageBackground source={require ('../../assets/logo-image-background.jpg')}>
        <Logo source={require ('../../assets/UU.png')}/>
      </LogoImageBackground>
      <DrawerItemList {...props}/>
    </DrawerContentScrollView>
  </Container>
  )
}

const Container = styled.View`
  flex: 1;
`;

const LogoImageBackground =  styled.ImageBackground`
  padding: 20px;
  padding-top: 120px;
  margin: 0;
  margin-top: -100px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Logo = styled.Image`
  height: 140px;
  aspect-ratio: 1;
`

export default CustomDrawer;