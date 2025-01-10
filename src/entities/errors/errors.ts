

/** объекты ошибок для формы*/
export enum ERROR_ATTENTION_FOR_FORM {
    'name' = 'Please enter a valid name!',
    'siteUrl' = 'Please enter a valid site URL!',
    'activity' = 'Please enter the activity!',
    'hash' = 'Please enter the valid hash!',
    'logo' = 'please upload a logo!',
    'banner' = 'Please upload a video!',
    'geolocation' = 'Please enter geolocation!',
    'language' = 'Please select a language!',
    'mlm' = 'Please choose MLM!',
    'maxSizeLogo' = 'Image must be less then 3 MB!',
    'maxSizeBanner' = 'Video must be less then 15 MB!',
    'muchFiles' = 'Can add only 1 file!',
    'noHTTP' = 'Please enter a site URL with http:// or https://.',
}