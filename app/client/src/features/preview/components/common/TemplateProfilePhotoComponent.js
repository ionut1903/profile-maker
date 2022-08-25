import React from 'react'
import {HeaderElement} from "./TemplateHeaderComponent";

export const TemplateProfilePhotoComponent =({profilePhoto = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'})=>{
    return (
        <HeaderElement extraStyle={{width: "23%"}}>
            <img style={{width: '100%', height: '100%'}}
                 src={profilePhoto}
                 alt="Mertus consulting user profile"/>
        </HeaderElement>
    )
}