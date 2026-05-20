import { StyleSheet } from "react-native"; 


// Style geral, mas foi criado para o Header. 
export const Styles = StyleSheet.create({
  container: {
    paddingTop: 30, // espaço do status bar
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#2b2b2b',
  },

  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },

  searchContainerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
     justifyContent: 'space-between',
  },


  searchContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    //  justifyContent: 'space-between',
  },

  input: {
    flex: 1,
    height: 60,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 10,
    color: '#fff',
    marginTop:'auto',
  },

  button: {
    // marginLeft: 10,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 15,
    height: 60,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
  },
  buttonLogin: {
    marginLeft: 10,
    backgroundColor: '#000000',
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  SizeText:{
    color: '#999',
    fontSize: 13,
  },
});

// Caso sejá necessario algum background inteiro
export const Background =  StyleSheet.create({
    backLogin:{
        backgroundColor:'#000',
        height: '100%',
        width: '100%', 
        alignItems: 'center',
        justifyContent: 'center'
    },
    container:{
        backgroundColor: '#2b2b2b',
        width: '90%',
        height: '50%',
        borderRadius: 10,
        borderColor:'#3b3b3b',
        justifyContent: 'center',
        gap: 20
    },
    viewLogin: {
        height: 52,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        margin: 10,
  },
  input: {
        width: '100%',
        height: 52,
        backgroundColor: '#09090B',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#3F3F46',
        paddingHorizontal: 16,
        marginTop: 10,
        color: '#FFFFFF',
  },
  searchContainer: {
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        justifyContent: 'center'
  },
  buttonEntrar: {
        width: '40%',
        height: 52,
        backgroundColor: '#cccccc',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
  },
  buttonCadastro: {
        width: '40%',
        height: 52,
        backgroundColor: '#9D27FF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
  },

});















// caso eu precise de uma backup

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 30, // espaço do status bar
//     paddingHorizontal: 16,
//     paddingBottom: 10,
//     backgroundColor: '#2b2b2b',
//   },

//   logo: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 10,
//   },

//   searchContainerLogo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//      justifyContent: 'space-between',
//   },


//   searchContainer: {
//     paddingTop: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     //  justifyContent: 'space-between',
//   },

//   input: {
//     flex: 1,
//     height: 60,
//     backgroundColor: '#1E1E1E',
//     borderTopLeftRadius: 10,
//     borderBottomLeftRadius: 10,
//     paddingHorizontal: 10,
//     color: '#fff',
//   },

//   button: {
//     // marginLeft: 10,
//     backgroundColor: '#1E1E1E',
//     paddingHorizontal: 15,
//     height: 60,
//     borderTopRightRadius: 10,
//     borderBottomRightRadius: 10,
//     justifyContent: 'center',
//   },
//   buttonLogin: {
//     marginLeft: 10,
//     backgroundColor: '#000000',
//     paddingHorizontal: 15,
//     height: 40,
//     borderRadius: 10,
//     justifyContent: 'center',
//   },

//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });