import { View, Text, Image, ImageBackground, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';

const PokemonDetailsScreen = ({ navigateTo, pokemon }) => (
  <ImageBackground 
    source={require('./assets/Legend-fundo.jpg')}
    style={styles.backgroundDetails}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('FiltroPokemon')}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      {pokemon ? (
        <View style={styles.infoCard}>
          <Text style={styles.title}>{pokemon.name.toUpperCase()}</Text>
          <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
          <Text style={styles.pokemonInfo}>ID: {pokemon.id}</Text>
          <Text style={styles.pokemonInfo}>Altura: {pokemon.height / 10} m</Text>
          <Text style={styles.pokemonInfo}>Peso: {pokemon.weight / 10} kg</Text>
          <Text style={styles.pokemonInfo}>
            Stats:{" "}
            {pokemon.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`).join(', ')}
          </Text>
          <Text style={styles.pokemonInfo}>
            Habilidades:{" "}
            {pokemon.abilities.map((ability) => ability.ability.name).join(', ')}
          </Text>
        </View>
      ) : (
        <Text style={styles.error}>Detalhes do Pokémon não disponíveis.</Text>
      )}
    </View>
  </ImageBackground>
);

const FiltroPokemonScreen = ({ navigateTo }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=155&offset=494');
        const data = await response.json();
        const detailedData = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );
        setPokemonList(detailedData);
        setFilteredPokemon(detailedData);
      } catch (error) {
        console.error('Erro ao buscar os Pokémons:', error);
      }
    };
    fetchPokemon();
  }, []);

  const filterByType = (type) => {
    if (type === '') {
      setFilteredPokemon(pokemonList);
    } else {
      setFilteredPokemon(
        pokemonList.filter((pokemon) =>
          pokemon.types.some((t) => t.type.name === type)
        )
      );
    }
    setTypeFilter(type);
  };

  return (
    <ImageBackground 
      source={require('./assets/Legend-details.jpg')} 
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Pokedex de Unova</Text>
        <Picker
          selectedValue={typeFilter}
          style={styles.picker}
          onValueChange={(itemValue) => filterByType(itemValue)}>
            <Picker.Item label="Todos" value="" />
            <Picker.Item label="Normal" value="normal" />
            <Picker.Item label="Fogo" value="fire" />
            <Picker.Item label="Água" value="water" />
            <Picker.Item label="Grama" value="grass" />
            <Picker.Item label="Elétrico" value="electric" />
            <Picker.Item label="Gelo" value="ice" />
            <Picker.Item label="Lutador" value="fighting" />
            <Picker.Item label="Venenoso" value="poison" />
            <Picker.Item label="Terrestre" value="ground" />
            <Picker.Item label="Voador" value="flying" />
            <Picker.Item label="Psíquico" value="psychic" />
            <Picker.Item label="Inseto" value="bug" />
            <Picker.Item label="Pedra" value="rock" />
            <Picker.Item label="Fantasma" value="ghost" />
            <Picker.Item label="Dragão" value="dragon" />
            <Picker.Item label="Sombrio" value="dark" />
            <Picker.Item label="Metal" value="steel" />
            <Picker.Item label="Fada" value="fairy" />
        </Picker>
        <FlatList
          data={filteredPokemon}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.sprites.front_default }} style={styles.image} />
              <Text style={styles.pokemonName}>{item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigateTo('PokemonDetails', item)}>
                <Text style={styles.buttonText}>Pokédex</Text>
              </TouchableOpacity>
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.cardRow}
          ListEmptyComponent={<Text style={styles.error}>Nenhum Pokémon encontrado.</Text>}
        />
      </View>
    </ImageBackground>
  );
};

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('FiltroPokemon');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const navigateTo = (screen, data) => {
    if (screen === 'PokemonDetails') {
      setSelectedPokemon(data);
    }
    setCurrentScreen(screen);
  };

  switch (currentScreen) {
    case 'FiltroPokemon':
      return <FiltroPokemonScreen navigateTo={navigateTo} />;
    case 'PokemonDetails':
      return <PokemonDetailsScreen navigateTo={navigateTo} pokemon={selectedPokemon} />;
    default:
      return <FiltroPokemonScreen navigateTo={navigateTo} />;
  }
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    border: '3px solid royalBlue',
  },
  backgroundDetails: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    border: '3px solid gray',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  pokemonInfo: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 5,
  },
  picker: {
    width: '80%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(169, 169, 169, 0.6)',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    elevation: 3,
    border: '3px solid black',
  },
  cardRow: {
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    border: '1px solid lightBlue'
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  error: {
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#121212',
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  infoCard: {
    backgroundColor: 'rgba(169, 169, 169, 0.6)',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
    top: 60,
    border: '3px solid black',
  },
});

export default App;