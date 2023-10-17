/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
      extend: {
        colors : {
            "footerColor" : "#FD375B",
            "arrowBg" : "#DCDBDA",
            "main-bg" : "#f9fafb",
            "sideBarITemsColor" : "#748290",
            "loginLeft" : "#cf888c",
        },
        fontFamily: {
          'ps': ['Public Sans', 'sans-serif'],
        },
        spacing : {
          '100' : '90px',
          '200' : '110px',
          '300' : '130px',
          '18' : '4.6rem',
          '68' : '17.5rem',
          '69' : '19rem',
          '400' : '28rem',
        },
        padding: {
          '55':'13.85rem',
        },
        fontSize : {
          '3xs' : '0.6rem',
          '2xs' : '0.675rem',
          'xsm' : '0.8rem',
          'md' : '1rem',
        }
      },
    },
    plugins: [],
  }

