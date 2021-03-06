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

import HeaderComponent from '../../Components/HeaderComponent';
import styles from '../../styles';
import InputComponent, {
  pickerStyles,
  pickerWrapper,
  SimpleSelect,
} from '../Add/InputComponent';
import ImagePickerAdd from '../../Components/native/ImagePIckerAdd';
import ShadowButton from '../../Components/ShadowButton';
import CheckboxComponent from '../../Components/CheckboxComponent';
import {useDispatch, useSelector} from 'react-redux';

import {
  getBrandModels,
  getBrands,
  getCar,
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
  getService,
  getServicesWithCategory,
  getSparePart,
  getSparePartsWithCategory,
  getSteering,
  getTransmission,
  updateCar,
  updateService,
  updateSparePart,
  deleteImage,
} from '../../api';
import {load} from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import {ToastShow} from '../../Components/ToastShow';

export const getCurrentPhotos = photosArr => {
  let newArr = [];
  photosArr.forEach(url => {
    let arr = url.split('/');
    newArr.push({
      name: arr[arr.length - 1],
      type: `img/${arr[arr.length - 1].split('.')[1]}`,
      uri: url.split('/')[0] === 'https:' ? url : `https://carket.kg/${url}`,
    });
  });
  return newArr;
};
const getModelYears = (alias, models) => {
  let currentModel = models.filter(model => model.alias === alias)[0];
  let years = [];
  for (let i = currentModel.c_to; i >= currentModel.c_from; i--) {
    years.push(i.toString());
  }
  return years;
};

export default function UpdateAd({navigation, route}) {
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);
  const {spareParts, services, cars, owners, colors} = state;
  // --------------------------------------
  const window = Dimensions.get('window');
  const [width, setwidth] = useState(window.width);
  const [Horizontal, setHorizontal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const {alias, isCar, isSparePart, isService} = route.params;

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

  // --------------- View Style ---------------
  const [currentAd, setCurrentAd] = useState(null);
  const [partCategory, setPartCategory] = useState('');
  const [Video, setVideo] = useState('');
  const [exterior, setExterior] = useState([]);
  const [media, setMedia] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [options, setOptions] = useState([]);
  const [c_condition, setCarCondition] = useState('');
  const [description, setDescription] = useState('');
  const [transmission, setTransmission] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [sts, setSts] = useState('');
  const [ownersState, setOwners] = useState(0);
  const [condition_part, setCondition_part] = useState('new');
  const [Marka, setMarka] = useState('??????????');
  const [Model, setModel] = useState('????????????');
  const [Title, setTitle] = useState('');
  const [Series, setSeries] = useState('');
  const [Type, setType] = useState('');
  const [Year, setYear] = useState('');
  const [Floor, setFloor] = useState('');
  const [FloorInHome, setFloorInHome] = useState('');
  const [Heating, setHeating] = useState('');
  const [Drive, setDrive] = useState('');
  const [Mileage, setMileage] = useState('');
  const [Vin, setVin] = useState('');
  const [Region, setRegion] = useState('');
  const [City, setCity] = useState('');
  const [Price, setPrice] = useState('');
  const [Color, setColor] = useState({id: ''});
  const [Clearence, setClearence] = useState(false);
  const [modelYears, setModelYears] = useState([]);
  const [imagesToDelete, setImageToDelete] = useState([]);
  const [cities, setCities] = useState({regionAlias: Region});
  const [models, setModels] = useState({brandAlias: Marka});
  const [modifications, setModifications] = useState({generationAlias: Type});

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
  }, [Marka, models, state.models]);
  useEffect(() => {
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
  }, [cities, models, Region, state.towns]);
  useEffect(() => {
    // ?????????????????? ?????????????????? ???? ????????????????????
    if (
      state.generation.year !== Year &&
      Year !== '?????? ??????????????' &&
      Marka !== '??????????' &&
      Model !== '????????????'
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
  }, [Marka, Model, Year, Type, modifications]);
  // --------------------------------------
  useEffect(() => {
    if (!Boolean(currentAd)) {
      if (isSparePart && Boolean(spareParts[alias])) {
        setCurrentAd(spareParts[alias]);
      }
      if (isService && Boolean(services[alias])) {
        setCurrentAd(services[alias]);
      }
      if (isCar && Boolean(cars[alias])) {
        setCurrentAd(cars[alias]);
      }
      setImageToDelete([]);
    }
    if (isSparePart && !Boolean(state.spareParts[alias])) {
      dispatch(getSparePart({alias}));
    }
    if (isService && !Boolean(state.services[alias])) {
      dispatch(getService({alias}));
    }
    if (isCar && !Boolean(state.cars[alias])) {
      dispatch(getCar(alias));
    }
  }, [
    currentAd,
    spareParts,
    services,
    cars,
    isSparePart,
    isService,
    isCar,
    alias,
  ]);
  useEffect(() => {
    if (Boolean(currentAd)) {
      if (Boolean(currentAd.exterior)) {
        let arr = currentAd.exterior.split(',');
        setExterior(arr.splice(0, arr.length - 1));
      }
      if (Boolean(currentAd.media)) {
        let arr = currentAd.media.split(',');
        setMedia(arr.splice(0, arr.length - 1));
      }
      if (Boolean(currentAd.photos)) {
        setPhotos(getCurrentPhotos(currentAd.photos));
      }
      if (Boolean(currentAd.options)) {
        let arr = currentAd.options.split(',');
        setOptions(arr.splice(0, arr.length - 1).splice(0, arr.length - 1));
      }
      if (Boolean(currentAd.c_condition_alias)) {
        setCarCondition(currentAd.c_condition_alias);
      }
      if (Boolean(currentAd.description)) {
        setDescription(currentAd.description);
      }
      if (Boolean(currentAd.transmission_alias)) {
        setTransmission(currentAd.transmission_alias);
      }
      if (Boolean(parseInt(currentAd.category))) {
        setServiceCategory(currentAd.category);
      }
      if (Boolean(currentAd.sts)) {
        setSts(currentAd.sts);
      }
      if (Boolean(currentAd.owner_alias) && Boolean(owners)) {
        setOwners(
          owners.filter(item => item.alias === currentAd.owner_alias)[0].id,
        );
      }
      if (Boolean(currentAd.??_condition_alias)) {
        setCondition_part(
          currentAd.??_condition_alias === 'true'
            ? 'new'
            : currentAd.??_condition_alias === 'false'
            ? 'used'
            : currentAd.??_condition_alias,
        );
      }
      if (Boolean(currentAd.brand) || Boolean(currentAd.brand_alias)) {
        setMarka(currentAd.brand || currentAd.brand_alias);
      }
      if (
        (Boolean(currentAd.model) || Boolean(currentAd.model_alias)) &&
        Boolean(models.data)
      ) {
        setModel(currentAd.model || currentAd.model_alias);
        setModelYears(
          getModelYears(currentAd.model || currentAd.model_alias, models.data),
        );
      }
      if (Boolean(currentAd)) {
        setTitle(currentAd.title || currentAd.name);
      }
      if (Boolean(currentAd.modification)) {
        setSeries(currentAd.modification);
      }
      if (Boolean(currentAd.generation)) {
        setType(currentAd.generation);
      }
      if (Boolean(currentAd.year)) {
        setYear(currentAd.year);
      }
      if (Boolean(currentAd.steering_alias)) {
        setFloor(currentAd.steering_alias);
      }
      if (Boolean(currentAd.carcase_alias)) {
        setFloorInHome(currentAd.carcase_alias);
      }
      if (Boolean(currentAd.fuel_alias)) {
        setHeating(currentAd.fuel_alias);
      }
      if (Boolean(currentAd.drive_alias)) {
        setDrive(currentAd.drive_alias);
      }
      if (Boolean(currentAd.mileage)) {
        setMileage(currentAd.mileage);
      }
      if (Boolean(currentAd.vin)) {
        setVin(currentAd.vin);
      }
      if (Boolean(currentAd.region_id)) {
        setRegion(currentAd.region_id);
      }
      if (Boolean(currentAd.town_id) && parseInt(currentAd.town_id) > 0) {
        setCity(currentAd.town_id);
      }
      if (Boolean(currentAd.price)) {
        setPrice(currentAd.price);
      }
      if (Boolean(currentAd.color_alias) && Boolean(colors)) {
        setColor(
          colors.filter(color => color.alias === currentAd.color_alias)[0],
        );
      }
      if (Boolean(currentAd.car_custom)) {
        setClearence(currentAd.car_custom === '????????????????????');
      }
    }
  }, [currentAd, owners, models, colors]);
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
    if (!Boolean(colors)) {
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

  const callback = message => {
    setLoading(false);
    if (message) {
      ToastShow(message, 2000, 'success');
    }
  };
  const submitHandler = () => {
    // setLoading(true);
    let filteredPhotos = photos.filter(
      item => item.uri.split('/')[0] !== 'https:',
    );
    if (isCar) {
      let data = {
        alias,
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
        color: Color.id,
        modification: Series !== '??????????????????????' ? Series : '',
        fuel: Heating !== '??????????????' ? Heating : '',
        drive: Drive !== '????????????' ? Drive : '',
        generation: Type !== '??????????????????' ? Type : '',
        steering: Floor !== '????????' ? Floor : '',
        customs: Clearence.toString(),
        c_condition,
        owners: ownersState,
        photos: filteredPhotos.length > 0 ? filteredPhotos : '',
        transmission: transmission !== '??????' ? transmission : '',
        description,
        exterior,
        sts,
        media,
        options,
      };
      dispatch(updateCar(data, callback));
    }
    if (isSparePart) {
      let data = {
        alias,
        category: partCategory !== '???????????????? ????????????' ? partCategory : '',
        name: Title,
        region: Region !== '????????????' ? Region : '',
        town: City !== '??????????' ? City : '',
        price: Price,
        brand: Marka !== '??????????' ? Marka : '',
        model: Model !== '????????????' ? Model : '',
        condition_part,
        description,
        photos: filteredPhotos.length > 0 ? filteredPhotos : '',
      };
      dispatch(updateSparePart(data, callback));
    }
    if (isService) {
      let data = {
        alias,
        category: serviceCategory !== '???????????????? ????????????' ? serviceCategory : '',
        name: Title,
        region: Region !== '????????????' ? Region : '',
        town: City !== '??????????' ? City : '',
        photos: filteredPhotos.length > 0 ? filteredPhotos : '',
        description,
      };
      dispatch(updateService(data, callback));
    }
    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach(photo => {
        dispatch(
          deleteImage({
            alias,
            photo: photo.split('?')[0],
            category: isCar ? 'cars' : isSparePart ? 'parts' : 'service',
          }),
        );
      });
    }
  };
  return (
    <SafeAreaView>
      <Toast style={{zIndex: 1000}} ref={ref => Toast.setRef(ref)} />
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <HeaderComponent
        arrow={true}
        title={`${
          isSparePart
            ? '???????????????????????? ??? '
            : isService
            ? '???????????????????? ??? '
            : '???????????????? ??? '
        }${Title ? Title : '~'}`}
        navigation={navigation}
      />
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />

      {/* ----- Start Body ----- */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {Boolean(currentAd) ? (
          <View style={styles.ph20}>
            <Text style={styles.AddPageTitleStyles}>???????????????????? (???? 12 ????)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginTop: 10}}>
              {photos.length > 0 &&
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
                        if (item.uri.split('/')[0] === 'https:') {
                          setImageToDelete([...imagesToDelete, item.name]);
                        }
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
              {isCar
                ? '???? ????????'
                : isSparePart
                ? '???? ??????????????????????????'
                : '?????????????????? ?? ??????????????????'}
            </Text>

            {isService && (
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
            {!isService && (
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
                    setModel(value);
                    if (value !== '????????????') {
                      setModelYears(getModelYears(value, models.data));
                    }
                  }}
                  defaultValue="????????????"
                  data={models.data}
                  isLoading={models.brandAlias === Marka}
                />
              </>
            )}
            {isCar && (
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
                  isLoading={state.generation.year === Year}
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {colors &&
                    colors.map((item, index) => (
                      <View
                        key={item.id}
                        style={{
                          marginRight: colors.length === index + 1 ? 0 : 15,
                          width: 30,
                          height: 30,
                          borderRadius: 20,
                          alignItems: 'center',
                          marginTop: 20,
                          elevation: 0.5,
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0,0,0,0.2)',
                        }}>
                        <TouchableOpacity
                          onPress={() => setColor(item)}
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
                                opacity: Color.id === item.id ? 1 : 0,
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
              isLoading={cities.regionAlias === Region}
              valueKey="id"
            />
            {/* ------------ */}
            {/* ################################## */}
            {/* ----- Start Location ----- */}
            {isSparePart && (
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
            {!isService && (
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
            {isCar && (
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
                          width: width / 3.3,
                          alignItems: 'center',
                          alignSelf: 'center',
                          height: 20,
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          setOwners(e.id);
                          offsetSecond.value = withTiming(
                            key === 0
                              ? 0
                              : key === 1
                              ? Horizontal
                                ? width - 530
                                : width - 250
                              : key === 2
                              ? Horizontal
                                ? width - 300
                                : width - 140
                              : 0,
                          );
                        }}>
                        <Text
                          style={{
                            color: owners === key ? 'white' : 'black',
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
                  keyboardType="number-pad"
                  value={sts}
                  change={setSts}
                  placeholder="?????????????????????????? ?? ??????????????????????"
                  noIcon
                />
                <Text style={styles.AddPageTitleStyles}>
                  ?????????????? Vin ?????? ?????????? ????????????
                </Text>
                <InputComponent
                  keyboardType="number-pad"
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
                        isChecked={c_condition === item.id}
                        text={item.name}
                        textStyle={{color: '#636363'}}
                        onClick={() => setCarCondition(item.id)}
                      />
                    </View>
                  ))}
                {/* ----- End Options ----- */}
              </>
            )}
            {isSparePart && (
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
                    styleLabel={{
                      color: '#A7A7A7',
                      fontSize: 16,
                      marginLeft: 20,
                    }}
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
                    styleLabel={{
                      color: '#A7A7A7',
                      fontSize: 16,
                      marginLeft: 20,
                    }}
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
            <View style={{marginBottom: 30}} />

            <ShadowButton
              width="85%"
              text="???????????????? ????????????????????"
              Press={submitHandler}
              isLoading={isLoading}
            />
          </View>
        ) : (
          <View style={{marginTop: 20}}>{load}</View>
        )}
        <View style={{marginVertical: 60}} />
      </ScrollView>
    </SafeAreaView>
  );
}
