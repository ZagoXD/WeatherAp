
# WeatherApp

## Descrição

O **WeatherApp** é um aplicativo móvel desenvolvido em React Native que fornece previsões meteorológicas detalhadas para qualquer localização no mundo. Ele utiliza as APIs Weatherbit e OpenCage para obter dados climáticos e de localização, oferecendo uma experiência rica em informações com uma interface intuitiva e dinâmica.

### Principais Funcionalidades

- **Previsão Diária e Semanal**: Exibe a previsão do tempo detalhada para o dia atual e para a semana, com informações sobre temperaturas mínimas e máximas.
- **Gráfico de Variação de Temperatura**: Mostra as variações de temperatura ao longo da semana em um gráfico interativo.
- **Informações Adicionais**: Apresenta dados meteorológicos adicionais, como velocidade e direção do vento, índice de qualidade do ar (AQI), índice UV, horários de nascer e pôr do sol, umidade e precipitação.
- **Detecção Automática de Localização**: Usa o GPS do dispositivo para detectar a localização atual do usuário e fornecer a previsão do tempo correspondente.
- **Busca por Cidade**: Permite ao usuário buscar manualmente por cidades e visualizar as previsões para locais específicos.
- **Mudança Dinâmica de Background**: O plano de fundo do aplicativo muda dinamicamente com base nas condições climáticas e na hora do dia.

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento de aplicativos móveis multiplataforma.
- **Expo**: Plataforma que facilita o desenvolvimento e a execução de projetos React Native.
- **Weatherbit API**: API utilizada para obter dados meteorológicos detalhados.
- **OpenCage API**: API utilizada para obter dados de localização a partir de coordenadas geográficas.
- **Axios**: Biblioteca utilizada para realizar requisições HTTP.
- **react-native-chart-kit**: Biblioteca utilizada para renderização de gráficos no aplicativo.
- **Moment.js**: Biblioteca para manipulação e formatação de datas.

## Requisitos

- **Node.js**: 16.x ou superior
- **Expo CLI**: 6.x ou superior
- **Conta na Weatherbit API**: Chave de API necessária
- **Conta na OpenCage API**: Chave de API necessária

## Instalação

1. **Clone este repositório**:

    ```bash
    git clone https://github.com/seu-usuario/weather-app.git
    cd weather-app
    ```

2. **Instale as dependências**:

    ```bash
    npm install
    ```

3. **Crie um arquivo `config.js` na raiz do projeto e adicione suas chaves de API**:

    ```
    WEATHERBIT_API_KEY=your_weatherbit_api_key
    OPENCAGE_API_KEY=your_opencage_api_key
    ```

4. **Execute o projeto**:

    ```bash
    expo start
    ```

## Como Usar

1. **Localização Automática**: Ao abrir o aplicativo, permita o acesso à sua localização. O WeatherApp detectará automaticamente sua localização e mostrará a previsão do tempo correspondente.

2. **Busca por Cidade**: Use a barra de busca para encontrar previsões para outras cidades. Digite o nome da cidade e selecione-a na lista de sugestões.

3. **Visualização do Gráfico**: Deslize para ver o gráfico de variação de temperatura semanal. O gráfico é interativo e pode ser arrastado horizontalmente para visualizar todos os dados.

4. **Informações Adicionais**: Role até a seção de informações adicionais para visualizar dados como velocidade do vento, qualidade do ar e índices UV.

## Autor

- Gustavo Luiz Conceição Zago

## Licença

Este projeto está licenciado sob a Licença MIT 
