import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';
import {Picker} from '@react-native-picker/picker';

import {ToastShow} from '../../Components/ToastShow';
import HeaderComponent from '../../Components/HeaderComponent';
import styles from '../../styles';
import InputComponent, {
  pickerStyles,
  pickerWrapper,
  SimpleSelect,
} from './InputComponent';
import ImagePickerAdd from '../../Components/native/ImagePIckerAdd';
import ShadowButton from '../../Components/ShadowButton';
import CheckboxComponent from '../../Components/CheckboxComponent';
import {useDispatch, useSelector} from 'react-redux';
import {
  addCar,
  addService,
  addSparePart,
  getBrandModels,
  getBrands,
  getCarcase,
  getCarStatuses,
  getColors,
  getDrive,
  getExterior,
  getFuels,
  getGeneration,
  getMedia,
  getModification,
  getOptions,
  getOwners,
  getRegions,
  getRegionsTowns,
  getServicesWithCategory,
  getSparePartsWithCategory,
  getSteering,
  getTransmission,
} from '../../api';
import Toast from 'react-native-toast-message';
import {setData} from '../../Store';

const AddPage = ({navigation}) => {
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);
  const {alert} = state;
  // --------------------------------------
  const window = Dimensions.get('window');
  const [width, setwidth] = useState(window.width);
  const [Horizontal, setHorizontal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [Item, setItem] = useState(0);

  useEffect(() => {
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        setwidth(width);
        setHorizontal(false);
      } else {
        setwidth(width);
        setHorizontal(true);
      }
      setwidth(width);
    });
  }, []);
  // -------------
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offset.value,
        },
      ],
    };
  });

  const offsetSecond = useSharedValue(0);
  const animatedStylesSecond = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offsetSecond.value,
        },
      ],
    };
  });

  const listTab = [
    {id: 0, name: '????????????????'},
    {id: 1, name: '????????????????'},
    {id: 2, name: '????????????'},
  ];
  // --------------- View Style ---------------
  const [exterior, setExterior] = useState([]);
  const [media, setMedia] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [options, setOptions] = useState([]);
  const [c_condition, setCarCondition] = useState('ideal');
  const [description, setDescription] = useState('');
  const [transmission, setTransmission] = useState('');
  const [partCategory, setPartCategory] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [sts, setSts] = useState('');
  const [owner, setOwner] = useState('first');
  const [condition_part, setCondition_part] = useState('new');
  const [Marka, setMarka] = useState('??????????');
  const [Model, setModel] = useState('????????????');
  const [Title, setTitle] = useState('');
  const [Video, setVideo] = useState(
    'https://www.youtube.com/watch?v=2UoiMpUEZU8',
  );
  const [Series, setSeries] = useState('');
  const [Type, setType] = useState('');
  const [Year, setYear] = useState('?????? ??????????????');
  const [Floor, setFloor] = useState('');
  const [FloorInHome, setFloorInHome] = useState('');
  const [Heating, setHeating] = useState('');
  const [Drive, setDrive] = useState('');
  const [Mileage, setMileage] = useState('');
  const [Vin, setVin] = useState('');
  const [Region, setRegion] = useState('????????????');
  const [City, setCity] = useState('');
  const [Price, setPrice] = useState('');
  const [Color, setColor] = useState('1');
  const [Clearence, setClearence] = useState(false);
  const [modelYears, setModelYears] = useState([]);
  const [cities, setCities] = useState({regionAlias: 'Region'});
  const [models, setModels] = useState({brandAlias: 'Marka'});
  const [modifications, setModifications] = useState({generationAlias: 'Type'});

  useEffect(() => {
    // ?????????????????? ???????? ????????
    if (!Boolean(state.steering)) {
      dispatch(getSteering());
    }
    // ?????????????????? ???????? ??????????????
    if (!Boolean(state.carcase)) {
      dispatch(getCarcase());
    }
    // ?????????????????? ???????? ??????????????
    if (!Boolean(state.fuels)) {
      dispatch(getFuels());
    }
    // ?????????????????? ???????? ????????????????
    if (!Boolean(state.drive)) {
      dispatch(getDrive());
    }
    // ?????????????????? ???????? ??????
    if (!Boolean(state.transmission)) {
      dispatch(getTransmission());
    }
    // ?????????????????? ???????? ???????????? ????????????????????
    if (!Boolean(state.colors)) {
      dispatch(getColors());
    }
    // ?????????????????? ???????? ????????????????
    if (!Boolean(state.regions)) {
      dispatch(getRegions());
    }
    // ?????????????????? ???????? ??????????????
    if (!Boolean(state.brands)) {
      dispatch(getBrands());
    }
    // ?????????????????? ???????? ????????????????????
    if (!Boolean(state.owners)) {
      dispatch(getOwners());
    }
    // ?????????????????? ???????? ??????????
    if (!Boolean(state.options)) {
      dispatch(getOptions());
    }
    // ?????????????????? ???????? ??????????
    if (!Boolean(state.media)) {
      dispatch(getMedia());
    }
    // ?????????????????? ???????? ?????????????? ??????
    if (!Boolean(state.exterior)) {
      dispatch(getExterior());
    }
    // ?????????????????? ???????? ?????????????????? ????????
    if (!Boolean(state.car_statuses)) {
      dispatch(getCarStatuses());
    }
    // ?????????????????? ???????? ?????????????????????????? c ????????????????????
    if (!Boolean(state.sparePartsWithCategory)) {
      dispatch(getSparePartsWithCategory());
    }
    // ?????????????????? ???????? ?????????? c ????????????????????
    if (!Boolean(state.servicesWithCategory)) {
      dispatch(getServicesWithCategory());
    }
  }, []);
  useEffect(() => {
    // ?????????????????? ?????????????? ????????????
    if (
      models.brandAlias !== Marka &&
      Marka !== '??????????' &&
      Boolean(state.models)
    ) {
      if (Boolean(state.models[Marka])) {
        setModels(state.models[Marka]);
      } else {
        dispatch(getBrandModels({brand: Marka}));
      }
    }
    // ?????????????????? ?????????????????? ???? ????????????????????
    if (
      state.generation &&
      state.generation.year !== Year &&
      Year !== '?????? ??????????????' &&
      Marka !== '??????????' &&
      Model !== '????????????' &&
      Item === 0
    ) {
      dispatch(getGeneration({brand: Marka, model: Model, year: Year}));
    }
    // ???????????????? ?????????????????????? ?????????????????? ??????????????????
    if (modifications.generationAlias !== Type && Series !== '??????????????????????') {
      if (state.modification[Type]) {
        setModifications(state.modification[Type]);
      } else {
        dispatch(getModification({generation: Type}));
      }
    }
    if (
      state.alert.message === '?????? ????????????????????.' &&
      modifications.generationAlias !== Type &&
      Series !== '??????????????????????'
    ) {
      setModifications({generationAlias: Type});
    }
    // ?????????????????? ?????????????? ???????????????????? ??????????????
    if (
      cities.regionAlias !== Region &&
      Region !== '????????????' &&
      Boolean(state.regions)
    ) {
      if (Boolean(state.towns[Region])) {
        setCities(state.towns[Region]);
      } else {
        dispatch(getRegionsTowns({region_id: Region}));
      }
    }
  }, [state, Marka, Model, Year, Type, Region, models, cities, modifications]);
  // --------------------------------------
  useEffect(() => {
    if (alert.message) {
      ToastShow(alert.message, 2000, alert.severity);
      dispatch(setData({alert: {message: '', severity: ''}}));
    }
  }, [alert]);

  const callback = (params, json) => {
    setLoading(false);
    if (params) {
      ToastShow(json.message, 2000, 'success');
      setExterior([]);
      setMedia([]);
      setPhotos([]);
      setOptions;
      setModelYears([]);
      setVin('');
      setVideo('');
      setCarCondition('ideal');
      setDescription('');
      setTransmission('');
      setPartCategory('');
      setServiceCategory('');
      setSts('');
      setTitle('');
      setSeries('');
      setType('');
      setYear('?????? ??????????????');
      setFloor('');
      setFloorInHome('');
      setHeating('');
      setDrive('');
      setMileage('');
      setRegion('????????????');
      setCity('');
      setPrice('');
      setCondition_part('new');
      setMarka('??????????');
      setModel('????????????');
      setColor('1');
      setTimeout(() => navigation.navigate('AutoPage', params), 1000);
    }
  };
  const submitHandler = () => {
    setLoading(true);
    if (Item === 0) {
      let data = {
        vin: Vin,
        video: Video,
        region: Region !== '????????????' ? Region : '',
        town: City !== '??????????' ? City : '',
        price: Price,
        brand: Marka !== '??????????' ? Marka : '',
        model: Model !== '????????????' ? Model : '',
        year: Year !== '?????? ??????????????' ? Year : '',
        mileage: Mileage,
        carcase: FloorInHome !== '??????????' ? FloorInHome : '',
        color: Color,
        modification: Series !== '??????????????????????' ? Series : '',
        fuel: Heating !== '??????????????' ? Heating : '',
        drive: Drive !== '????????????' ? Drive : '',
        generation: Type !== '??????????????????' ? Type : '',
        steering: Floor !== '????????' ? Floor : '',
        customs: Clearence,
        c_condition,
        owner,
        photos,
        transmission: transmission !== '??????' ? transmission : '',
        description,
        exterior,
        sts,
        media,
        options,
      };
      dispatch(addCar(data, callback));
    }
    if (Item === 1) {
      let data = {
        category: partCategory !== '???????????????? ????????????' ? partCategory : '',
        name: Title,
        region: Region !== '????????????' ? Region : '',
        town: City !== '??????????' ? City : '',
        price: Price,
        brand: Marka !== '??????????' ? Marka : '',
        model: Model !== '????????????' ? Model : '',
        condition_part,
        description,
        photos,
      };
      dispatch(addSparePart(data, callback));
    }
    if (Item === 2) {
      let data = {
        category: serviceCategory !== '???????????????? ????????????' ? serviceCategory : '',
        name: Title,
        region: Region !== '????????????' ? Region : '',
        town: City !== '??????????' ? City : '',
        photos,
        description,
      };
      dispatch(addService(data, callback));
    }
  };

  return (
    <SafeAreaView>
      <Toast style={{zIndex: 1}} ref={ref => Toast.setRef(ref)} />
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <HeaderComponent
        arrow={true}
        title="???????????????????? ????????????????????"
        navigation={navigation}
      />
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      {/* ----- Start Body ----- */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.ph20}>
          {/* ----- Start Filter ----- */}
          <View
            style={{
              flexDirection: 'row',
              height: 40,
              marginTop: 43,
              backgroundColor: '#f4f6f8',
              width: '100%',
              borderRadius: 10,
              alignSelf: 'center',
              padding: 2,
            }}>
            <Animated.View
              style={[
                styles.box,
                {width: '33%', backgroundColor: '#EA4F3D'},
                animatedStyles,
              ]}
            />

            {listTab.map((e, key) => (
              <TouchableOpacity
                activeOpacity={1}
                key={key}
                style={{
                  width: width / 3.45,
                  alignItems: 'center',
                  alignSelf: 'center',
                  height: 20,
                  justifyContent: 'center',
                }}
                onPress={() => {
                  setItem(e.id);
                  offset.value = withTiming(
                    e.id === 0
                      ? 0
                      : e.id === 1
                      ? width / 3.45
                      : (width / 3.45) * 2,
                  );
                }}>
                <Text
                  style={{
                    color: Item === key ? 'white' : 'black',
                    marginHorizontal: 16,
                  }}>
                  {e.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* ----- End Filter ----- */}

          <Text style={styles.AddPageTitleStyles}>???????????????????? (???? 12 ????)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 10}}>
            {photos &&
              photos.map((item, index) => (
                <View
                  key={index}
                  style={{
                    width: width / 2,
                    position: 'relative',
                    marginHorizontal: 10,
                  }}>
                  <Image
                    resizeMode="stretch"
                    source={{
                      uri: item.uri,
                    }}
                    style={{
                      width: '100%',
                      height: 100,
                      borderRadius: 5,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      let newState = photos.filter((_, i) => i !== index);
                      setPhotos(newState);
                    }}
                    style={{
                      width: 25,
                      height: 25,
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#3a3a3a',
                      borderRadius: 12.5,
                    }}>
                    <Image
                      source={require('../../assets/X.png')}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
          <ImagePickerAdd images={photos} setImage={setPhotos} />
          <Text style={[styles.AddPageTitleStyles, {marginTop: 40}]}>
            {Item === 0
              ? '???? ????????'
              : Item === 1
              ? '???? ??????????????????????????'
              : '?????????????????? ?? ??????????????????'}
          </Text>

          {Item === 2 && (
            <>
              <InputComponent
                placeholder="?????????????????? ????????????????????"
                value={Title}
                change={setTitle}
                noIcon
              />
              <SimpleSelect
                state={serviceCategory}
                setState={setServiceCategory}
                defaultValue="???????????????? ????????????"
                data={state.servicesWithCategory}
                isLoading={Boolean(state.servicesWithCategory)}
                valueKey="value"
              />
            </>
          )}
          {Item < 2 && (
            <>
              {/* --------------------------- */}
              <SimpleSelect
                state={Marka}
                setState={setMarka}
                defaultValue="??????????"
                data={state.brands}
                isLoading={Boolean(state.brands)}
              />
              {/* ------------ */}
              <SimpleSelect
                state={Model}
                setState={value => {
                  if (value !== '????????????') {
                    let currentModel = models.data.filter(
                      model => model.alias === value,
                    )[0];
                    let years = [];
                    for (
                      let i = currentModel.c_to;
                      i >= currentModel.c_from;
                      i--
                    ) {
                      years.push(i.toString());
                    }
                    setModelYears(years);
                  }
                  setModel(value);
                }}
                defaultValue="????????????"
                data={models.data}
                isLoading={Marka === '??????????' || models.brandAlias === Marka}
              />
            </>
          )}
          {Item === 0 && (
            <>
              {/* ------------ */}
              <View style={pickerWrapper}>
                <Picker
                  onValueChange={value => setYear(value)}
                  selectedValue={Year}
                  dropdownIconColor="#000000"
                  style={pickerStyles}>
                  <Picker.Item label="?????? ??????????????" value="?????? ??????????????" />
                  {Boolean(modelYears) &&
                    modelYears.map((str, index) => (
                      <Picker.Item label={str} value={str} key={index} />
                    ))}
                </Picker>
              </View>
              {/* ------------ */}
              <SimpleSelect
                state={Type}
                setState={setType}
                defaultValue="??????????????????"
                data={state.generation.data}
                isLoading={
                  Year === '?????? ??????????????' || state.generation.year === Year
                }
              />
              {/* ------------ */}
              <SimpleSelect
                state={Series}
                setState={setSeries}
                defaultValue="??????????????????????"
                data={modifications.data}
                isLoading={modifications.generationAlias === Type}
              />
              {/* ------------ */}
              <SimpleSelect
                defaultValue="????????"
                state={Floor}
                setState={setFloor}
                data={state.steering}
                isLoading={Boolean(state.steering)}
              />
              {/* ------------ */}
              <SimpleSelect
                defaultValue="??????????"
                state={FloorInHome}
                setState={setFloorInHome}
                data={state.carcase}
                isLoading={Boolean(state.carcase)}
              />
              {/* ------------ */}
              <SimpleSelect
                defaultValue="??????????????"
                state={Heating}
                setState={setHeating}
                data={state.fuels}
                isLoading={Boolean(state.fuels)}
              />
              {/* ------------ */}
              <SimpleSelect
                defaultValue="????????????"
                state={Drive}
                setState={setDrive}
                data={state.drive}
                isLoading={Boolean(state.drive)}
              />
              {/* ------------ */}
              <SimpleSelect
                defaultValue="??????"
                state={transmission}
                setState={setTransmission}
                data={state.transmission}
                isLoading={Boolean(state.transmission)}
              />
              <View style={[styles.fdRow, {marginTop: 40}]}>
                <Image
                  style={{width: 24, height: 24}}
                  source={require('../../assets/YouTube.png')}
                />
                <Text
                  style={[
                    styles.AddPageTitleStyles,
                    {marginLeft: 10, marginTop: 0},
                  ]}>
                  ???????????? ???? YouTube
                </Text>
              </View>
              <InputComponent
                value={Video}
                change={setVideo}
                placeholder="???????????? ???? YouTube"
                noIcon
              />
              <Text style={{fontSize: 12, marginTop: 10}}>
                ???????????????? ???????????????????? ?? ?????????? ?????????????????????? - ?????? ?????????????????? ????????????
                ????????????????, ???????????????? ?????????????? ?? ???????????????? ?? ???????????????? ??????????????????????
                ????????????
              </Text>
              {/* ----------------------- */}
              <Text style={styles.AddPageTitleStyles}>???????? ????????????????????</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  marginTop: 20,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {state.colors &&
                  state.colors.map((item, index) => (
                    <View
                      key={item.id}
                      style={{
                        marginRight: state.colors.length === index + 1 ? 0 : 15,
                        width: 30,
                        height: 30,
                        borderRadius: 20,
                        alignItems: 'center',
                        elevation: 0.5,
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                      }}>
                      <TouchableOpacity
                        onPress={() => setColor(item.id)}
                        activeOpacity={1}
                        style={{
                          backgroundColor: 'white',
                          width: 28,
                          height: 28,
                          borderRadius: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                          // padding: 4,
                        }}>
                        <View
                          style={{
                            backgroundColor: `#${item.hex}`,
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: 50,
                          }}>
                          <Image
                            style={{
                              width: 24,
                              height: 24,
                              opacity: Color === item.id ? 1 : 0,
                              alignSelf: 'center',
                            }}
                            source={
                              item.alias === 'white' || item.alias === 'beige'
                                ? require('../../assets/CheckIcon.png')
                                : require('../../assets/DoneIcon.png')
                            }
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
              </ScrollView>
              {/* --------------------------- */}
              <Text style={styles.AddPageTitleStyles}>????????????</Text>
              <InputComponent
                keyboardType="number-pad"
                value={Mileage}
                change={setMileage}
                placeholder="????"
                noIcon
              />
              <CheckboxComponent
                style={{paddingVertical: 15}}
                isChecked={Clearence}
                text="????????????????????"
                textStyle={{fontSize: 14, color: 'black'}}
                onClick={() => setClearence(!Clearence)}
              />
            </>
          )}
          {/* ----- End Item===0 ----- */}

          {/* ----- Start Location ----- */}
          <Text style={styles.AddPageTitleStyles}>????????????????????????</Text>
          <SimpleSelect
            defaultValue="????????????"
            state={Region}
            setState={setRegion}
            data={state.regions}
            isLoading={Boolean(state.regions)}
            valueKey="id"
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="??????????"
            state={City}
            setState={setCity}
            data={cities.data}
            isLoading={Region === '????????????' || cities.regionAlias === Region}
            valueKey="id"
          />
          {/* ------------ */}
          {/* ################################## */}
          {/* ----- Start Location ----- */}
          {Item === 1 && (
            <>
              <Text style={styles.AddPageTitleStyles}>
                ?????????????????? ?? ??????????????????
              </Text>
              <InputComponent
                placeholder="?????????????????? ????????????????????"
                value={Title}
                change={setTitle}
                noIcon
              />
              {/* ------------ */}
              <SimpleSelect
                state={partCategory}
                setState={setPartCategory}
                defaultValue="???????????????? ????????????"
                data={state.sparePartsWithCategory}
                isLoading={Boolean(state.sparePartsWithCategory)}
                valueKey="value"
              />
            </>
          )}
          {/* ------------ */}
          {/* ################################## */}
          {Item !== 2 && (
            <>
              <Text style={styles.AddPageTitleStyles}>????????</Text>
              <InputComponent
                keyboardType="number-pad"
                value={Price}
                change={setPrice}
                placeholder="$"
                noIcon
              />
            </>
          )}
          {/* ################################## */}
          {Item === 0 && (
            <>
              {/* ----- Start Second Filter ----- */}
              <Text style={styles.AddPageTitleStyles}>?????????? ???? ????????????????</Text>

              <View
                style={{
                  flexDirection: 'row',
                  height: 40,
                  marginVertical: 12,
                  backgroundColor: '#f4f6f8',
                  width: '100%',
                  borderRadius: 10,
                  alignSelf: 'center',
                  padding: 2,
                }}>
                <Animated.View
                  style={[
                    styles.box,
                    {width: '33%', backgroundColor: '#EA4F3D'},
                    animatedStylesSecond,
                  ]}
                />
                {/* Second List */}
                {state.owners &&
                  state.owners.map((e, key) => (
                    <TouchableOpacity
                      activeOpacity={1}
                      key={key}
                      style={{
                        width: width / 3.45,
                        alignItems: 'center',
                        alignSelf: 'center',
                        height: 20,
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        setOwner(e.alias);
                        offsetSecond.value = withTiming(
                          key === 0
                            ? 0
                            : key === 1
                            ? width / 3.45
                            : (width / 3.45) * 2,
                        );
                      }}>
                      <Text
                        style={{
                          color: owner === e.alias ? 'white' : 'black',
                          textAlign: 'center',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: width / 4.5,
                        }}>
                        {e.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
              {/*  ----- End Second Filter ----- */}
              <Text style={styles.AddPageTitleStyles}>
                ?????????????????????????? ?? ?????????????????????? (??????)
              </Text>
              <InputComponent
                value={sts}
                change={setSts}
                placeholder="?????????????????????????? ?? ??????????????????????"
                noIcon
              />
              <Text style={styles.AddPageTitleStyles}>
                ?????????????? Vin ?????? ?????????? ????????????
              </Text>
              <InputComponent
                value={Vin}
                change={setVin}
                placeholder="VIn/?????????? ????????????"
                noIcon
              />
              <Image
                style={{width: 192, height: 28, marginVertical: 10}}
                source={require('../../assets/AddPageSpecialIcon.png')}
              />
              {/* ----- Start ViewStyle ----- */}
              <Text style={styles.AddPageTitleStyles}>?????????????? ??????</Text>
              {state.exterior &&
                state.exterior.map((item, index) => (
                  <View
                    style={{
                      paddingVertical: 5,
                      borderBottomWidth:
                        state.exterior.length === index + 1 ? 0 : 1,
                      borderBottomColor: '#F2F2F2',
                    }}
                    key={item.id}>
                    <CheckboxComponent
                      style={{paddingVertical: 10}}
                      isChecked={exterior.indexOf(item.id) !== -1}
                      text={item.name}
                      textStyle={{color: '#636363'}}
                      onClick={() =>
                        setExterior(state =>
                          exterior.indexOf(item.id) === -1
                            ? [...state, item.id]
                            : state.filter(id => id !== item.id),
                        )
                      }
                    />
                  </View>
                ))}
              {/* ----- End ViewStyle ----- */}

              {/* ----- Start Media ----- */}
              <Text style={styles.AddPageTitleStyles}>??????????</Text>
              {state.media &&
                state.media.map((item, index) => (
                  <View
                    style={{
                      paddingVertical: 5,
                      borderBottomWidth:
                        state.media.length === index + 1 ? 0 : 1,
                      borderBottomColor: '#F2F2F2',
                    }}
                    key={item.id}>
                    <CheckboxComponent
                      style={{paddingVertical: 10}}
                      isChecked={media.indexOf(item.id) !== -1}
                      text={item.name}
                      textStyle={{color: '#636363'}}
                      onClick={() =>
                        setMedia(state =>
                          media.indexOf(item.id) === -1
                            ? [...state, item.id]
                            : state.filter(id => id !== item.id),
                        )
                      }
                    />
                  </View>
                ))}
              {/* ----- End Media ----- */}
              {/* ----- Start Options ----- */}
              <Text style={styles.AddPageTitleStyles}>??????????</Text>
              {state.options &&
                state.options.map((item, index) => (
                  <View
                    style={{
                      paddingVertical: 5,
                      borderBottomWidth:
                        state.options.length === index + 1 ? 0 : 1,
                      borderBottomColor: '#F2F2F2',
                    }}
                    key={item.id}>
                    <CheckboxComponent
                      style={{paddingVertical: 10}}
                      isChecked={options.indexOf(item.id) !== -1}
                      text={item.name}
                      textStyle={{color: '#636363'}}
                      onClick={() =>
                        setOptions(state =>
                          options.indexOf(item.id) === -1
                            ? [...state, item.id]
                            : state.filter(id => id !== item.id),
                        )
                      }
                    />
                  </View>
                ))}
              {/* ----- End Options ----- */}
              {/* ----- Start State ----- */}
              <Text style={styles.AddPageTitleStyles}>??????????????????</Text>
              {state.car_statuses &&
                state.car_statuses.map((item, index) => (
                  <View
                    style={{
                      paddingVertical: 5,
                      borderBottomWidth:
                        state.car_statuses.length === index + 1 ? 0 : 1,
                      borderBottomColor: '#F2F2F2',
                    }}
                    key={item.id}>
                    <CheckboxComponent
                      style={{paddingVertical: 10}}
                      isChecked={c_condition === item.alias}
                      text={item.name}
                      textStyle={{color: '#636363'}}
                      onClick={() => setCarCondition(item.alias)}
                    />
                  </View>
                ))}
              {/* ----- End Options ----- */}
            </>
          )}
          {Item === 1 && (
            <>
              <Text style={styles.AddPageTitleStyles}>??????????????????</Text>

              <View
                style={[
                  styles.fdRow,
                  {justifyContent: 'space-between', marginTop: 15},
                ]}>
                <Text style={{color: '#0D0D0D'}}>??????????</Text>
                <CircleCheckBox
                  checked={condition_part === 'new'}
                  filterSize={22}
                  outerColor="#ececec"
                  innerColor="#EA4F3D"
                  filterColor="#FFF"
                  onToggle={() => setCondition_part('new')}
                  labelPosition={LABEL_POSITION.LEFT}
                  label=""
                  styleLabel={{color: '#A7A7A7', fontSize: 16, marginLeft: 20}}
                />
              </View>
              <View
                style={{
                  height: 1,
                  marginVertical: 17,
                  backgroundColor: '#F2F2F2',
                }}
              />
              <View style={[styles.fdRow, {justifyContent: 'space-between'}]}>
                <Text style={{color: '#0D0D0D'}}>??/??</Text>
                <CircleCheckBox
                  checked={condition_part === 'used'}
                  filterSize={22}
                  outerColor="#ececec"
                  innerColor="#EA4F3D"
                  filterColor="#FFF"
                  onToggle={() => setCondition_part('used')}
                  labelPosition={LABEL_POSITION.LEFT}
                  label=""
                  styleLabel={{color: '#A7A7A7', fontSize: 16, marginLeft: 20}}
                />
              </View>
            </>
          )}
          <Text style={[styles.AddPageTitleStyles, {marginBottom: 10}]}>
            ?????????? ????????????????????
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline={true}
            placeholder="?????????? ????????????????????"
            style={{
              minHeight: 285,
              paddingBottom: 250,
              paddingHorizontal: 21,
              backgroundColor: '#EEEEEE',
              borderRadius: 7,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <Text style={{fontSize: 12, color: '#0D0D0D', marginVertical: 10}}>
            ?????????????????????? ???????????? ????????????, ?????????????????? ???????????? ??????????, ???????????? ??????????
            ??????????????, ???????????????? ?? ????????
          </Text>
          {/* ------------------------ */}
          {/* ----- Start Price ----- */}

          {/* ------------ */}
          {/* --- End Switches --- */}
          {/* --- Start '' --- */}
          {/* {Item !== 2 && (
            <>
              <Text style={{fontSize: 16, marginTop: 26}}>??????????????</Text>

              <InputComponent
              value={state.user.phone}
              change={setPhone}
                placeholder="+996 555 555 555"
                noIcon
              />
            </>
          )} */}
          {/* --- End Phone --- */}
          <View style={{marginBottom: 30}} />

          <ShadowButton
            width="85%"
            text="???????????? ????????????????????"
            Press={submitHandler}
            isLoading={isLoading}
          />
        </View>
        <View style={{marginVertical: 60}} />
      </ScrollView>
      {/* ----- End Body ----- */}
    </SafeAreaView>
  );
};

export default AddPage;
