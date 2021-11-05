/* Copyright© 2000 - 2021 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
/* Copyright© 2000 - 2021 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import { SuperMap } from './SuperMap';
import {
  DataFormat,
  ServerType,
  GeometryType,
  QueryOption,
  JoinType,
  EngineType,
  MeasureMode,
  SpatialRelationType,
  DataReturnMode,
  Unit,
  BufferRadiusUnit,
  SpatialQueryMode,
  ThemeGraphTextFormat,
  ThemeGraphType,
  GraphAxesTextDisplayMode,
  GraduatedMode,
  RangeMode,
  ThemeType,
  ColorGradientType,
  TextAlignment,
  FillGradientMode,
  SideType,
  AlongLineDirection,
  LabelBackShape,
  LabelOverLengthMode,
  DirectionType,
  OverlayOperationType,
  SupplyCenterType,
  TurnType,
  BufferEndType,
  SmoothMethod,
  SurfaceAnalystMethod,
  ColorSpaceType,
  ChartType,
  EditType,
  TransferTactic,
  TransferPreference,
  GridType,
  ClientType,
  LayerType,
  UGCLayerType,
  StatisticMode,
  PixelFormat,
  SearchMode,
  SummaryType,
  InterpolationAlgorithmType,
  VariogramMode,
  Exponent,
  ClipAnalystMode,
  AnalystAreaUnit,
  AnalystSizeUnit,
  StatisticAnalystMode,
  TopologyValidatorRule,
  OutputType,
  MetricsAggType,
  BucketAggType,
  GetFeatureMode,
  RasterFunctionType,
  ResourceType,
  OrderBy,
  OrderType,
  SearchType,
  AggregationTypes,
  PermissionType,
  EntityType,
  REST_DataItemType,
  WebExportFormatType,
  WebScaleOrientationType,
  WebScaleType,
  WebScaleUnit
} from './REST';
import {
  Collection,
  Curve,
  GeoText,
  LinearRing,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  GeometryPoint,
  Polygon,
  Rectangle,
  inheritExt,
  mixinExt,
  StringExt,
  NumberExt,
  FunctionExt,
  ArrayExt,
  Bounds,
  Credential,
  DateExt,
  Event,
  Events,
  Feature,
  Geometry,
  LonLat,
  Pixel,
  Size,
  CommonUtil,
  GeometryVector
} from './commontypes';
import { Format, GeoJSON, JSONFormat, WKT } from './format';

import { TimeControlBase, TimeFlowControl } from './control';
import { IManager, IManagerCreateNodeParam, IManagerServiceBase } from './iManager';
import {
  IPortal,
  IPortalQueryParam,
  IPortalResource,
  IPortalQueryResult,
  IPortalShareParam,
  IPortalShareEntity,
  IPortalServiceBase,
  IPortalUser,
  IPortalAddResourceParam,
  IPortalRegisterServiceParam,
  IPortalAddDataParam,
  IPortalDataMetaInfoParam,
  IPortalDataStoreInfoParam,
  IPortalDataConnectionInfoParam
} from './iPortal';
import {
  AddressMatchService,
  AggregationParameter,
  BucketAggParameter,
  MetricsAggParameter,
  AreaSolarRadiationParameters,
  AreaSolarRadiationService,
  BufferAnalystParameters,
  BufferAnalystService,
  BufferDistance,
  BufferSetting,
  BuffersAnalystJobsParameter,
  BuffersAnalystJobsService,
  BurstPipelineAnalystParameters,
  BurstPipelineAnalystService,
  ChartFeatureInfoSpecsService,
  ChartQueryFilterParameter,
  ChartQueryParameters,
  ChartQueryService,
  ClipParameter,
  ColorDictionary,
  CommonServiceBase,
  ComputeWeightMatrixParameters,
  ComputeWeightMatrixService,
  DataFlowService,
  DataReturnOption,
  DatasetBufferAnalystParameters,
  DatasetInfo,
  DatasetOverlayAnalystParameters,
  DatasetService,
  DatasetSurfaceAnalystParameters,
  DatasetThiessenAnalystParameters,
  DatasourceConnectionInfo,
  DatasourceService,
  DensityAnalystService,
  DensityKernelAnalystParameters,
  EditFeaturesParameters,
  EditFeaturesService,
  FacilityAnalyst3DParameters,
  FacilityAnalystSinks3DParameters,
  FacilityAnalystSinks3DService,
  FacilityAnalystSources3DParameters,
  FacilityAnalystSources3DService,
  FacilityAnalystStreamParameters,
  FacilityAnalystStreamService,
  FacilityAnalystTracedown3DParameters,
  FacilityAnalystTracedown3DService,
  FacilityAnalystTraceup3DParameters,
  FacilityAnalystTraceup3DService,
  FacilityAnalystUpstream3DParameters,
  FacilityAnalystUpstream3DService,
  FieldParameters,
  FieldStatisticService,
  FieldStatisticsParameters,
  FilterParameter,
  FindClosestFacilitiesParameters,
  FindClosestFacilitiesService,
  FindLocationParameters,
  FindLocationService,
  FindMTSPPathsParameters,
  FindMTSPPathsService,
  FindPathParameters,
  FindPathService,
  FindServiceAreasParameters,
  FindServiceAreasService,
  FindTSPPathsParameters,
  FindTSPPathsService,
  GenerateSpatialDataParameters,
  GenerateSpatialDataService,
  GeoCodingParameter,
  GeoprocessingService,
  GeoDecodingParameter,
  GeoHashGridAggParameter,
  InterpolationDensityAnalystParameters,
  GeometryBufferAnalystParameters,
  GeometryOverlayAnalystParameters,
  GeometrySurfaceAnalystParameters,
  GeometryThiessenAnalystParameters,
  GeoRelationAnalystParameters,
  GeoRelationAnalystService,
  GetFeaturesByBoundsParameters,
  GetFeaturesByBoundsService,
  GetFeaturesByBufferParameters,
  GetFeaturesByBufferService,
  GetFeaturesByGeometryParameters,
  GetFeaturesByGeometryService,
  GetFeaturesByIDsParameters,
  GetFeaturesByIDsService,
  GetFeaturesBySQLParameters,
  GetFeaturesBySQLService,
  GetFeaturesParametersBase,
  GetFeaturesServiceBase,
  GetFieldsService,
  GetGridCellInfosParameters,
  GetGridCellInfosService,
  GetLayersInfoService,
  Grid,
  UGCImage,
  InterpolationAnalystParameters,
  InterpolationAnalystService,
  InterpolationIDWAnalystParameters,
  InterpolationKrigingAnalystParameters,
  InterpolationRBFAnalystParameters,
  JoinItem,
  KernelDensityJobParameter,
  KernelDensityJobsService,
  LabelImageCell,
  LabelMatrixCell,
  LabelMixedTextStyle,
  LabelSymbolCell,
  LabelThemeCell,
  LayerStatus,
  LinkItem,
  MapService,
  MathExpressionAnalysisParameters,
  MathExpressionAnalysisService,
  MeasureParameters,
  MeasureService,
  NetworkAnalystServiceBase,
  OutputSetting,
  MappingParameters,
  OverlapDisplayedOptions,
  OverlayAnalystParameters,
  OverlayAnalystService,
  OverlayGeoJobParameter,
  OverlayGeoJobsService,
  PointWithMeasure,
  ProcessingServiceBase,
  QueryByBoundsParameters,
  QueryByBoundsService,
  QueryByDistanceParameters,
  QueryByDistanceService,
  QueryByGeometryParameters,
  QueryByGeometryService,
  QueryBySQLParameters,
  QueryBySQLService,
  QueryParameters,
  QueryService,
  Route,
  RouteCalculateMeasureParameters,
  RouteCalculateMeasureService,
  RouteLocatorParameters,
  RouteLocatorService,
  ServerColor,
  ServerFeature,
  ServerGeometry,
  ServerStyle,
  ServerTextStyle,
  ServerTheme,
  SetDatasourceParameters,
  SetLayerInfoParameters,
  SetLayerInfoService,
  SetLayersInfoParameters,
  SetLayersInfoService,
  SetLayerStatusParameters,
  SetLayerStatusService,
  SingleObjectQueryJobsParameter,
  SingleObjectQueryJobsService,
  SpatialAnalystBase,
  StopQueryParameters,
  StopQueryService,
  SummaryAttributesJobsParameter,
  SummaryAttributesJobsService,
  SummaryMeshJobParameter,
  SummaryMeshJobsService,
  SummaryRegionJobParameter,
  SummaryRegionJobsService,
  SupplyCenter,
  SurfaceAnalystParameters,
  SurfaceAnalystParametersSetting,
  SurfaceAnalystService,
  TerrainCurvatureCalculationParameters,
  TerrainCurvatureCalculationService,
  Theme,
  ThemeDotDensity,
  ThemeFlow,
  ThemeGraduatedSymbol,
  ThemeGraduatedSymbolStyle,
  ThemeGraph,
  ThemeGraphAxes,
  ThemeGraphItem,
  ThemeGraphSize,
  ThemeGraphText,
  ThemeGridRange,
  ThemeGridRangeItem,
  ThemeGridUnique,
  ThemeGridUniqueItem,
  ThemeLabel,
  ThemeLabelAlongLine,
  ThemeLabelBackground,
  ThemeLabelItem,
  ThemeLabelText,
  ThemeLabelUniqueItem,
  ThemeMemoryData,
  ThemeOffset,
  ThemeParameters,
  ThemeRange,
  ThemeRangeItem,
  ThemeService,
  ThemeUnique,
  ThemeUniqueItem,
  ThiessenAnalystParameters,
  ThiessenAnalystService,
  GeometryBatchAnalystService,
  TilesetsService,
  TopologyValidatorJobsParameter,
  TopologyValidatorJobsService,
  TransferLine,
  TransferPathParameters,
  TransferPathService,
  TransferSolutionService,
  TransportationAnalystParameter,
  TransportationAnalystResultSetting,
  TransferSolutionParameters,
  UGCLayer,
  UGCMapLayer,
  UGCSubLayer,
  UpdateEdgeWeightParameters,
  UpdateEdgeWeightService,
  UpdateTurnNodeWeightParameters,
  UpdateTurnNodeWeightService,
  UpdateDatasetParameters,
  CreateDatasetParameters,
  Vector,
  VectorClipJobsParameter,
  VectorClipJobsService,
  RasterFunctionParameter,
  NDVIParameter,
  HillshadeParameter,
  WebPrintingJobCustomItems,
  WebPrintingJobImage,
  WebPrintingJobLayers,
  WebPrintingJobLegendOptions,
  WebPrintingJobLittleMapOptions,
  WebPrintingJobNorthArrowOptions,
  WebPrintingJobScaleBarOptions,
  WebPrintingJobContent,
  WebPrintingJobLayoutOptions,
  WebPrintingJobExportOptions,
  WebPrintingJobParameters,
  WebPrintingService,
  FieldsFilter,
  ImageGFAspect,
  ImageGFHillShade,
  ImageGFOrtho,
  ImageGFSlope,
  ImageSearchParameter,
  ImageRenderingRule,
  Sortby,
  ImageStretchOption,
  ImageCollectionService,
  ImageService
} from './iServer';
import {
  Online,
  OnlineData,
  OnlineQueryDatasParameter,
  ServiceStatus,
  DataItemType,
  DataItemOrderBy,
  FilterField,
  OnlineServiceBase
} from './online';
import { KeyServiceParameter, SecurityManager, ServerInfo, TokenServiceParameter } from './security';
import {
  BinaryClassification,
  LandcoverClassification,
  ObjectDetection,
  WebMachineLearning,
  ElasticSearch
} from './thirdparty';
import {
  setCORS,
  isCORS,
  setRequestTimeout,
  getRequestTimeout,
  FetchRequest,
  RequestJSONPPromise,
  ColorsPickerUtil,
  ArrayStatistic,
  getMeterPerMapUnit,
  getWrapNum,
  conversionDegree
} from './util';
import { CartoCSS, ThemeStyle } from './style';
import {
  Bar,
  Bar3D,
  Circle,
  Graph,
  Line,
  Pie,
  OverlayPoint,
  RankSymbol,
  Ring,
  ThemeVector,
  ShapeFactory,
  ShapeParameters,
  FeatureCircle,
  Image,
  Label,
  FeatureLine,
  Point,
  FeaturePolygon,
  FeatureRectangle,
  Sector,
  FeatureTheme,
  LevelRenderer,
  Render,
  Animation,
  Animator,
  Area,
  Clip,
  Color,
  ComputeBoundingBox,
  Config,
  LevelRendererCurve,
  Easing,
  Env,
  LevelRendererEvent,
  Eventful,
  Group,
  Handler,
  Http,
  Log,
  MathTool,
  Matrix,
  Painter,
  PaintLayer,
  Shape,
  SmicBrokenLine,
  SmicCircle,
  SmicEllipse,
  SmicImage,
  SmicIsogon,
  SmicPoint,
  SmicPolygon,
  SmicRectangle,
  SmicRing,
  SmicSector,
  SmicStar,
  SmicText,
  Storage,
  Transformable,
  Util,
  LevelRendererVector,
  SUtil
} from './overlay';
import {
  FileTypes,
  FileConfig,
  FileModel,
  MessageBox,
  CommonContainer,
  DropDownBox,
  Select,
  TemplateBase,
  AttributesPopContainer,
  PopContainer,
  IndexTabsPageContainer,
  CityTabsPage,
  NavTabsPage,
  PaginationContainer,
  ComponentsUtil,
  FileReaderUtil,
  ChartView,
  ChartViewModel
} from './components';
import { Lang, en, zh } from './lang';

if (window && window.SuperMap) {
  let SuperMap = (window.SuperMap = window.SuperMap || {});

  // CommonUtil
  SuperMap.Util = CommonUtil || {};
  SuperMap.Browser = (function () {
    var name = '',
      version = '',
      device = 'pc',
      uaMatch;
    //以下进行测试
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('msie') > -1 || (ua.indexOf('trident') > -1 && ua.indexOf('rv') > -1)) {
      name = 'msie';
      uaMatch = ua.match(/msie ([\d.]+)/) || ua.match(/rv:([\d.]+)/);
    } else if (ua.indexOf('chrome') > -1) {
      name = 'chrome';
      uaMatch = ua.match(/chrome\/([\d.]+)/);
    } else if (ua.indexOf('firefox') > -1) {
      name = 'firefox';
      uaMatch = ua.match(/firefox\/([\d.]+)/);
    } else if (ua.indexOf('opera') > -1) {
      name = 'opera';
      uaMatch = ua.match(/version\/([\d.]+)/);
    } else if (ua.indexOf('safari') > -1) {
      name = 'safari';
      uaMatch = ua.match(/version\/([\d.]+)/);
    }
    version = uaMatch ? uaMatch[1] : '';

    if (ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1 || ua.indexOf('iphone') > -1) {
      device = 'apple';
    } else if (ua.indexOf('android') > -1) {
      uaMatch = ua.match(/version\/([\d.]+)/);
      version = uaMatch ? uaMatch[1] : '';
      device = 'android';
    }
    return { name: name, version: version, device: device };
  })();
  SuperMap.INCHES_PER_UNIT = {
    inches: 1.0,
    ft: 12.0,
    mi: 63360.0,
    m: 39.3701,
    km: 39370.1,
    dd: 4374754,
    yd: 36
  };
  SuperMap.INCHES_PER_UNIT['in'] = SuperMap.INCHES_PER_UNIT.inches;
  SuperMap.INCHES_PER_UNIT['degrees'] = SuperMap.INCHES_PER_UNIT.dd;
  SuperMap.INCHES_PER_UNIT['nmi'] = 1852 * SuperMap.INCHES_PER_UNIT.m;

  // Units from CS-Map
  SuperMap.METERS_PER_INCH = 0.0254000508001016002;
  SuperMap.Util.extend(SuperMap.INCHES_PER_UNIT, {
    Inch: SuperMap.INCHES_PER_UNIT.inches,
    Meter: 1.0 / SuperMap.METERS_PER_INCH, //EPSG:9001
    Foot: 0.30480060960121920243 / SuperMap.METERS_PER_INCH, //EPSG:9003
    IFoot: 0.3048 / SuperMap.METERS_PER_INCH, //EPSG:9002
    ClarkeFoot: 0.3047972651151 / SuperMap.METERS_PER_INCH, //EPSG:9005
    SearsFoot: 0.30479947153867624624 / SuperMap.METERS_PER_INCH, //EPSG:9041
    GoldCoastFoot: 0.30479971018150881758 / SuperMap.METERS_PER_INCH, //EPSG:9094
    IInch: 0.0254 / SuperMap.METERS_PER_INCH,
    MicroInch: 0.0000254 / SuperMap.METERS_PER_INCH,
    Mil: 0.0000000254 / SuperMap.METERS_PER_INCH,
    Centimeter: 0.01 / SuperMap.METERS_PER_INCH,
    Kilometer: 1000.0 / SuperMap.METERS_PER_INCH, //EPSG:9036
    Yard: 0.91440182880365760731 / SuperMap.METERS_PER_INCH,
    SearsYard: 0.914398414616029 / SuperMap.METERS_PER_INCH, //EPSG:9040
    IndianYard: 0.91439853074444079983 / SuperMap.METERS_PER_INCH, //EPSG:9084
    IndianYd37: 0.91439523 / SuperMap.METERS_PER_INCH, //EPSG:9085
    IndianYd62: 0.9143988 / SuperMap.METERS_PER_INCH, //EPSG:9086
    IndianYd75: 0.9143985 / SuperMap.METERS_PER_INCH, //EPSG:9087
    IndianFoot: 0.30479951 / SuperMap.METERS_PER_INCH, //EPSG:9080
    IndianFt37: 0.30479841 / SuperMap.METERS_PER_INCH, //EPSG:9081
    IndianFt62: 0.3047996 / SuperMap.METERS_PER_INCH, //EPSG:9082
    IndianFt75: 0.3047995 / SuperMap.METERS_PER_INCH, //EPSG:9083
    Mile: 1609.34721869443738887477 / SuperMap.METERS_PER_INCH,
    IYard: 0.9144 / SuperMap.METERS_PER_INCH, //EPSG:9096
    IMile: 1609.344 / SuperMap.METERS_PER_INCH, //EPSG:9093
    NautM: 1852.0 / SuperMap.METERS_PER_INCH, //EPSG:9030
    'Lat-66': 110943.316488932731 / SuperMap.METERS_PER_INCH,
    'Lat-83': 110946.25736872234125 / SuperMap.METERS_PER_INCH,
    Decimeter: 0.1 / SuperMap.METERS_PER_INCH,
    Millimeter: 0.001 / SuperMap.METERS_PER_INCH,
    Dekameter: 10.0 / SuperMap.METERS_PER_INCH,
    Decameter: 10.0 / SuperMap.METERS_PER_INCH,
    Hectometer: 100.0 / SuperMap.METERS_PER_INCH,
    GermanMeter: 1.0000135965 / SuperMap.METERS_PER_INCH, //EPSG:9031
    CaGrid: 0.999738 / SuperMap.METERS_PER_INCH,
    ClarkeChain: 20.1166194976 / SuperMap.METERS_PER_INCH, //EPSG:9038
    GunterChain: 20.11684023368047 / SuperMap.METERS_PER_INCH, //EPSG:9033
    BenoitChain: 20.116782494375872 / SuperMap.METERS_PER_INCH, //EPSG:9062
    SearsChain: 20.11676512155 / SuperMap.METERS_PER_INCH, //EPSG:9042
    ClarkeLink: 0.201166194976 / SuperMap.METERS_PER_INCH, //EPSG:9039
    GunterLink: 0.2011684023368047 / SuperMap.METERS_PER_INCH, //EPSG:9034
    BenoitLink: 0.20116782494375872 / SuperMap.METERS_PER_INCH, //EPSG:9063
    SearsLink: 0.2011676512155 / SuperMap.METERS_PER_INCH, //EPSG:9043
    Rod: 5.02921005842012 / SuperMap.METERS_PER_INCH,
    IntnlChain: 20.1168 / SuperMap.METERS_PER_INCH, //EPSG:9097
    IntnlLink: 0.201168 / SuperMap.METERS_PER_INCH, //EPSG:9098
    Perch: 5.02921005842012 / SuperMap.METERS_PER_INCH,
    Pole: 5.02921005842012 / SuperMap.METERS_PER_INCH,
    Furlong: 201.1684023368046 / SuperMap.METERS_PER_INCH,
    Rood: 3.778266898 / SuperMap.METERS_PER_INCH,
    CapeFoot: 0.3047972615 / SuperMap.METERS_PER_INCH,
    Brealey: 375.0 / SuperMap.METERS_PER_INCH,
    ModAmFt: 0.304812252984505969011938 / SuperMap.METERS_PER_INCH,
    Fathom: 1.8288 / SuperMap.METERS_PER_INCH,
    'NautM-UK': 1853.184 / SuperMap.METERS_PER_INCH,
    '50kilometers': 50000.0 / SuperMap.METERS_PER_INCH,
    '150kilometers': 150000.0 / SuperMap.METERS_PER_INCH
  });

  //unit abbreviations supported by PROJ.4
  SuperMap.Util.extend(SuperMap.INCHES_PER_UNIT, {
    mm: SuperMap.INCHES_PER_UNIT['Meter'] / 1000.0,
    cm: SuperMap.INCHES_PER_UNIT['Meter'] / 100.0,
    dm: SuperMap.INCHES_PER_UNIT['Meter'] * 100.0,
    km: SuperMap.INCHES_PER_UNIT['Meter'] * 1000.0,
    kmi: SuperMap.INCHES_PER_UNIT['nmi'], //International Nautical Mile
    fath: SuperMap.INCHES_PER_UNIT['Fathom'], //International Fathom
    ch: SuperMap.INCHES_PER_UNIT['IntnlChain'], //International Chain
    link: SuperMap.INCHES_PER_UNIT['IntnlLink'], //International Link
    'us-in': SuperMap.INCHES_PER_UNIT['inches'], //U.S. Surveyor's Inch
    'us-ft': SuperMap.INCHES_PER_UNIT['Foot'], //U.S. Surveyor's Foot
    'us-yd': SuperMap.INCHES_PER_UNIT['Yard'], //U.S. Surveyor's Yard
    'us-ch': SuperMap.INCHES_PER_UNIT['GunterChain'], //U.S. Surveyor's Chain
    'us-mi': SuperMap.INCHES_PER_UNIT['Mile'], //U.S. Surveyor's Statute Mile
    'ind-yd': SuperMap.INCHES_PER_UNIT['IndianYd37'], //Indian Yard
    'ind-ft': SuperMap.INCHES_PER_UNIT['IndianFt37'], //Indian Foot
    'ind-ch': 20.11669506 / SuperMap.METERS_PER_INCH //Indian Chain
  });

  SuperMap.IS_GECKO = (function () {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('webkit') === -1 && ua.indexOf('gecko') !== -1;
  })();
  /**
   * @description 浏览器是否支持 Canvas。
   * @returns {boolean} 获取当前浏览器是否支持 HTML5 Canvas。
   */
  SuperMap.Util.isSupportCanvas = (function () {
    var checkRes = true,
      broz = SuperMap.Util.getBrowser();
    if (document.createElement('canvas').getContext) {
      if (broz.name === 'firefox' && parseFloat(broz.version) < 5) {
        checkRes = false;
      }
      if (broz.name === 'safari' && parseFloat(broz.version) < 4) {
        checkRes = false;
      }
      if (broz.name === 'opera' && parseFloat(broz.version) < 10) {
        checkRes = false;
      }
      if (broz.name === 'msie' && parseFloat(broz.version) < 9) {
        checkRes = false;
      }
    } else {
      checkRes = false;
    }
    return checkRes;
  })();

  //将服务端的地图单位转成SuperMap的地图单位
  SuperMap.INCHES_PER_UNIT['degree'] = SuperMap.INCHES_PER_UNIT.dd;
  SuperMap.INCHES_PER_UNIT['meter'] = SuperMap.INCHES_PER_UNIT.m;
  SuperMap.INCHES_PER_UNIT['foot'] = SuperMap.INCHES_PER_UNIT.ft;
  SuperMap.INCHES_PER_UNIT['inch'] = SuperMap.INCHES_PER_UNIT.inches;
  SuperMap.INCHES_PER_UNIT['mile'] = SuperMap.INCHES_PER_UNIT.mi;
  SuperMap.INCHES_PER_UNIT['kilometer'] = SuperMap.INCHES_PER_UNIT.km;
  SuperMap.INCHES_PER_UNIT['yard'] = SuperMap.INCHES_PER_UNIT.yd;

  // FetchRequest
  SuperMap.setCORS = setCORS;
  SuperMap.isCORS = isCORS;
  SuperMap.setRequestTimeout = setRequestTimeout;
  SuperMap.getRequestTimeout = getRequestTimeout;
  SuperMap.FetchRequest = FetchRequest;
  SuperMap.Util.RequestJSONPPromise = RequestJSONPPromise;

  // commontypes
  SuperMap.inherit = inheritExt;
  SuperMap.mixin = mixinExt;
  SuperMap.String = StringExt;
  SuperMap.Number = NumberExt;
  SuperMap.Function = FunctionExt;
  SuperMap.Array = ArrayExt;
  SuperMap.Date = DateExt;
  SuperMap.Event = Event;
  /* prevent memory leaks in IE */
  SuperMap.Event.observe(window, 'unload', SuperMap.Event.unloadCache, false);
  SuperMap.Bounds = Bounds;
  SuperMap.Credential = Credential;
  SuperMap.Events = Events;
  SuperMap.Events.prototype.BROWSER_EVENTS = [
    'mouseover',
    'mouseout',
    'mousedown',
    'mouseup',
    'mousemove',
    'click',
    'dblclick',
    'rightclick',
    'dblrightclick',
    'resize',
    'focus',
    'blur',
    'touchstart',
    'touchmove',
    'touchend',
    'keydown',
    'MSPointerDown',
    'MSPointerUp',
    'pointerdown',
    'pointerup',
    'MSGestureStart',
    'MSGestureChange',
    'MSGestureEnd',
    'contextmenu'
  ];
  SuperMap.Feature = Feature;
  SuperMap.Geometry = Geometry;
  SuperMap.Pixel = Pixel;
  SuperMap.Size = Size;
  SuperMap.Feature.Vector = Vector;
  SuperMap.Geometry.Collection = Collection;
  SuperMap.Geometry.Curve = Curve;
  SuperMap.Geometry.GeoText = GeoText;
  SuperMap.Geometry.LinearRing = LinearRing;
  SuperMap.Geometry.LineString = LineString;
  SuperMap.Geometry.MultiLineString = MultiLineString;
  SuperMap.Geometry.MultiPoint = MultiPoint;
  SuperMap.Geometry.MultiPolygon = MultiPolygon;
  SuperMap.Geometry.Point = GeometryPoint;
  SuperMap.Geometry.Polygon = Polygon;
  SuperMap.Geometry.Rectangle = Rectangle;
  // Components
  SuperMap.Components = window.SuperMap.Components || {};
  SuperMap.Components.Chart = ChartView;
  SuperMap.Components.ChartViewModel = ChartViewModel;
  SuperMap.Components.MessageBox = MessageBox;
  SuperMap.Components.AttributesPopContainer = AttributesPopContainer;
  SuperMap.Components.CityTabsPage = CityTabsPage;
  SuperMap.Components.CommonContainer = CommonContainer;
  SuperMap.Components.DropDownBox = DropDownBox;
  SuperMap.Components.IndexTabsPageContainer = IndexTabsPageContainer;
  SuperMap.Components.NavTabsPage = NavTabsPage;
  SuperMap.Components.PaginationContainer = PaginationContainer;
  SuperMap.Components.PopContainer = PopContainer;
  SuperMap.Components.Select = Select;
  SuperMap.Components.TemplateBase = TemplateBase;
  SuperMap.Components.FileReaderUtil = FileReaderUtil;
  // control
  SuperMap.TimeControlBase = TimeControlBase;
  SuperMap.TimeFlowControl = TimeFlowControl;
  // Format
  SuperMap.Format = SuperMap.Format || Format;
  SuperMap.Format.GeoJSON = GeoJSON;
  SuperMap.Format.JSON = JSONFormat;
  SuperMap.Format.WKT = WKT;
  // iManager
  SuperMap.iManager = IManager;
  SuperMap.iManagerCreateNodeParam = IManagerCreateNodeParam;
  SuperMap.iManagerServiceBase = IManagerServiceBase;
  // iPortal
  SuperMap.iPortal = IPortal;
  SuperMap.iPortalAddDataParam = IPortalAddDataParam;
  SuperMap.iPortalAddResourceParam = IPortalAddResourceParam;
  SuperMap.iPortalDataConnectionInfoParam = IPortalDataConnectionInfoParam;
  SuperMap.iPortalDataMetaInfoParam = IPortalDataMetaInfoParam;
  SuperMap.iPortalDataStoreInfoParam = IPortalDataStoreInfoParam;
  SuperMap.iPortalQueryParam = IPortalQueryParam;
  SuperMap.iPortalQueryResult = IPortalQueryResult;
  SuperMap.iPortalRegisterServiceParam = IPortalRegisterServiceParam;
  SuperMap.iPortalResource = IPortalResource;
  SuperMap.iPortalServiceBase = IPortalServiceBase;
  SuperMap.iPortalShareEntity = IPortalShareEntity;
  SuperMap.iPortalShareParam = IPortalShareParam;
  SuperMap.iPortalUser = IPortalUser;
  // iServer
  SuperMap.AddressMatchService = AddressMatchService;
  SuperMap.AggregationParameter = AggregationParameter;
  SuperMap.AreaSolarRadiationParameters = AreaSolarRadiationParameters;
  SuperMap.AreaSolarRadiationService = AreaSolarRadiationService;
  SuperMap.BucketAggParameter = BucketAggParameter;
  SuperMap.BufferAnalystParameters = BufferAnalystParameters;
  SuperMap.BufferAnalystService = BufferAnalystService;
  SuperMap.BufferDistance = BufferDistance;
  SuperMap.BuffersAnalystJobsParameter = BuffersAnalystJobsParameter;
  SuperMap.BuffersAnalystJobsService = BuffersAnalystJobsService;
  SuperMap.BufferSetting = BufferSetting;
  SuperMap.BurstPipelineAnalystParameters = BurstPipelineAnalystParameters;
  SuperMap.BurstPipelineAnalystService = BurstPipelineAnalystService;
  SuperMap.ChartFeatureInfoSpecsService = ChartFeatureInfoSpecsService;
  SuperMap.ChartQueryFilterParameter = ChartQueryFilterParameter;
  SuperMap.ChartQueryParameters = ChartQueryParameters;
  SuperMap.ChartQueryService = ChartQueryService;
  SuperMap.ClipParameter = ClipParameter;
  SuperMap.ColorDictionary = ColorDictionary;
  SuperMap.CommonServiceBase = CommonServiceBase;
  SuperMap.ComputeWeightMatrixParameters = ComputeWeightMatrixParameters;
  SuperMap.ComputeWeightMatrixService = ComputeWeightMatrixService;
  SuperMap.CreateDatasetParameters = CreateDatasetParameters;
  SuperMap.DataFlowService = DataFlowService;
  SuperMap.DataReturnOption = DataReturnOption;
  SuperMap.DatasetBufferAnalystParameters = DatasetBufferAnalystParameters;
  SuperMap.DatasetInfo = DatasetInfo;
  SuperMap.DatasetOverlayAnalystParameters = DatasetOverlayAnalystParameters;
  SuperMap.DatasetService = DatasetService;
  SuperMap.DatasetSurfaceAnalystParameters = DatasetSurfaceAnalystParameters;
  SuperMap.DatasetThiessenAnalystParameters = DatasetThiessenAnalystParameters;
  SuperMap.DatasourceConnectionInfo = DatasourceConnectionInfo;
  SuperMap.DatasourceService = DatasourceService;
  SuperMap.DensityAnalystService = DensityAnalystService;
  SuperMap.DensityKernelAnalystParameters = DensityKernelAnalystParameters;
  SuperMap.EditFeaturesParameters = EditFeaturesParameters;
  SuperMap.EditFeaturesService = EditFeaturesService;
  SuperMap.FacilityAnalyst3DParameters = FacilityAnalyst3DParameters;
  SuperMap.FacilityAnalystSinks3DParameters = FacilityAnalystSinks3DParameters;
  SuperMap.FacilityAnalystSinks3DService = FacilityAnalystSinks3DService;
  SuperMap.FacilityAnalystSources3DParameters = FacilityAnalystSources3DParameters;
  SuperMap.FacilityAnalystSources3DService = FacilityAnalystSources3DService;
  SuperMap.FacilityAnalystStreamParameters = FacilityAnalystStreamParameters;
  SuperMap.FacilityAnalystStreamService = FacilityAnalystStreamService;
  SuperMap.FacilityAnalystTracedown3DParameters = FacilityAnalystTracedown3DParameters;
  SuperMap.FacilityAnalystTracedown3DService = FacilityAnalystTracedown3DService;
  SuperMap.FacilityAnalystTraceup3DParameters = FacilityAnalystTraceup3DParameters;
  SuperMap.FacilityAnalystTraceup3DService = FacilityAnalystTraceup3DService;
  SuperMap.FacilityAnalystUpstream3DParameters = FacilityAnalystUpstream3DParameters;
  SuperMap.FacilityAnalystUpstream3DService = FacilityAnalystUpstream3DService;
  SuperMap.FieldParameters = FieldParameters;
  SuperMap.FieldsFilter = FieldsFilter;
  SuperMap.FieldStatisticService = FieldStatisticService;
  SuperMap.FieldStatisticsParameters = FieldStatisticsParameters;
  SuperMap.FilterParameter = FilterParameter;
  SuperMap.FindClosestFacilitiesParameters = FindClosestFacilitiesParameters;
  SuperMap.FindClosestFacilitiesService = FindClosestFacilitiesService;
  SuperMap.FindLocationParameters = FindLocationParameters;
  SuperMap.FindLocationService = FindLocationService;
  SuperMap.FindMTSPPathsParameters = FindMTSPPathsParameters;
  SuperMap.FindMTSPPathsService = FindMTSPPathsService;
  SuperMap.FindPathParameters = FindPathParameters;
  SuperMap.FindPathService = FindPathService;
  SuperMap.FindServiceAreasParameters = FindServiceAreasParameters;
  SuperMap.FindServiceAreasService = FindServiceAreasService;
  SuperMap.FindTSPPathsParameters = FindTSPPathsParameters;
  SuperMap.FindTSPPathsService = FindTSPPathsService;
  SuperMap.GenerateSpatialDataParameters = GenerateSpatialDataParameters;
  SuperMap.GenerateSpatialDataService = GenerateSpatialDataService;
  SuperMap.GeoCodingParameter = GeoCodingParameter;
  SuperMap.GeoDecodingParameter = GeoDecodingParameter;
  SuperMap.GeoHashGridAggParameter = GeoHashGridAggParameter;
  SuperMap.GeometryBatchAnalystService = GeometryBatchAnalystService;
  SuperMap.GeometryBufferAnalystParameters = GeometryBufferAnalystParameters;
  SuperMap.GeometryOverlayAnalystParameters = GeometryOverlayAnalystParameters;
  SuperMap.GeometrySurfaceAnalystParameters = GeometrySurfaceAnalystParameters;
  SuperMap.GeometryThiessenAnalystParameters = GeometryThiessenAnalystParameters;
  SuperMap.GeoprocessingService = GeoprocessingService;
  SuperMap.GeoRelationAnalystParameters = GeoRelationAnalystParameters;
  SuperMap.GeoRelationAnalystService = GeoRelationAnalystService;
  SuperMap.GetFeaturesByBoundsParameters = GetFeaturesByBoundsParameters;
  SuperMap.GetFeaturesByBoundsService = GetFeaturesByBoundsService;
  SuperMap.GetFeaturesByBufferParameters = GetFeaturesByBufferParameters;
  SuperMap.GetFeaturesByBufferService = GetFeaturesByBufferService;
  SuperMap.GetFeaturesByGeometryParameters = GetFeaturesByGeometryParameters;
  SuperMap.GetFeaturesByGeometryService = GetFeaturesByGeometryService;
  SuperMap.GetFeaturesByIDsParameters = GetFeaturesByIDsParameters;
  SuperMap.GetFeaturesByIDsService = GetFeaturesByIDsService;
  SuperMap.GetFeaturesBySQLParameters = GetFeaturesBySQLParameters;
  SuperMap.GetFeaturesBySQLService = GetFeaturesBySQLService;
  SuperMap.GetFeaturesParametersBase = GetFeaturesParametersBase;
  SuperMap.GetFeaturesServiceBase = GetFeaturesServiceBase;
  SuperMap.GetFieldsService = GetFieldsService;
  SuperMap.GetGridCellInfosParameters = GetGridCellInfosParameters;
  SuperMap.GetGridCellInfosService = GetGridCellInfosService;
  SuperMap.GetLayersInfoService = GetLayersInfoService;
  SuperMap.Grid = Grid;
  SuperMap.HillshadeParameter = HillshadeParameter;
  SuperMap.Image = UGCImage;
  SuperMap.ImageCollectionService = ImageCollectionService;
  SuperMap.ImageGFAspect = ImageGFAspect;
  SuperMap.ImageGFHillShade = ImageGFHillShade;
  SuperMap.ImageGFOrtho = ImageGFOrtho;
  SuperMap.ImageGFSlope = ImageGFSlope;
  SuperMap.ImageRenderingRule = ImageRenderingRule;
  SuperMap.ImageSearchParameter = ImageSearchParameter;
  SuperMap.ImageService = ImageService;
  SuperMap.ImageStretchOption = ImageStretchOption;
  SuperMap.ImageStretchOption.StretchType = {
    NONE: 'NONE',
    GAUSSIAN: 'GAUSSIAN',
    PERCENTCLIP: 'PERCENTCLIP',
    MINIMUMMAXIMUM: 'MINIMUMMAXIMUM',
    STANDARDDEVIATION: 'STANDARDDEVIATION'
  };
  SuperMap.InterpolationAnalystParameters = InterpolationAnalystParameters;
  SuperMap.InterpolationAnalystService = InterpolationAnalystService;
  SuperMap.InterpolationDensityAnalystParameters = InterpolationDensityAnalystParameters;
  SuperMap.InterpolationIDWAnalystParameters = InterpolationIDWAnalystParameters;
  SuperMap.InterpolationKrigingAnalystParameters = InterpolationKrigingAnalystParameters;
  SuperMap.InterpolationRBFAnalystParameters = InterpolationRBFAnalystParameters;
  SuperMap.JoinItem = JoinItem;
  SuperMap.KernelDensityJobParameter = KernelDensityJobParameter;
  SuperMap.KernelDensityJobsService = KernelDensityJobsService;
  SuperMap.LabelImageCell = LabelImageCell;
  SuperMap.LabelMatrixCell = LabelMatrixCell;
  SuperMap.LabelMixedTextStyle = LabelMixedTextStyle;
  SuperMap.LabelSymbolCell = LabelSymbolCell;
  SuperMap.LabelThemeCell = LabelThemeCell;
  SuperMap.LayerStatus = LayerStatus;
  SuperMap.LinkItem = LinkItem;
  SuperMap.MappingParameters = MappingParameters;
  SuperMap.MapService = MapService;
  SuperMap.MathExpressionAnalysisParameters = MathExpressionAnalysisParameters;
  SuperMap.MathExpressionAnalysisService = MathExpressionAnalysisService;
  SuperMap.MeasureParameters = MeasureParameters;
  SuperMap.MeasureService = MeasureService;
  SuperMap.MetricsAggParameter = MetricsAggParameter;
  SuperMap.NDVIParameter = NDVIParameter;
  SuperMap.NetworkAnalystServiceBase = NetworkAnalystServiceBase;
  SuperMap.OutputSetting = OutputSetting;
  SuperMap.OverlapDisplayedOptions = OverlapDisplayedOptions;
  SuperMap.OverlayAnalystParameters = OverlayAnalystParameters;
  SuperMap.OverlayAnalystService = OverlayAnalystService;
  SuperMap.OverlayGeoJobParameter = OverlayGeoJobParameter;
  SuperMap.OverlayGeoJobsService = OverlayGeoJobsService;
  SuperMap.PointWithMeasure = PointWithMeasure;
  SuperMap.ProcessingServiceBase = ProcessingServiceBase;
  SuperMap.QueryByBoundsParameters = QueryByBoundsParameters;
  SuperMap.QueryByBoundsService = QueryByBoundsService;
  SuperMap.QueryByDistanceParameters = QueryByDistanceParameters;
  SuperMap.QueryByDistanceService = QueryByDistanceService;
  SuperMap.QueryByGeometryParameters = QueryByGeometryParameters;
  SuperMap.QueryByGeometryService = QueryByGeometryService;
  SuperMap.QueryBySQLParameters = QueryBySQLParameters;
  SuperMap.QueryBySQLService = QueryBySQLService;
  SuperMap.QueryParameters = QueryParameters;
  SuperMap.QueryService = QueryService;
  SuperMap.RasterFunctionParameter = RasterFunctionParameter;
  SuperMap.Route = Route;
  SuperMap.RouteCalculateMeasureParameters = RouteCalculateMeasureParameters;
  SuperMap.RouteCalculateMeasureService = RouteCalculateMeasureService;
  SuperMap.RouteLocatorParameters = RouteLocatorParameters;
  SuperMap.RouteLocatorService = RouteLocatorService;
  SuperMap.ServerColor = ServerColor;
  SuperMap.ServerFeature = ServerFeature;
  SuperMap.ServerGeometry = ServerGeometry;
  SuperMap.ServerStyle = ServerStyle;
  SuperMap.ServerTextStyle = ServerTextStyle;
  SuperMap.ServerTheme = ServerTheme;
  SuperMap.SetDatasourceParameters = SetDatasourceParameters;
  SuperMap.SetLayerInfoParameters = SetLayerInfoParameters;
  SuperMap.SetLayerInfoService = SetLayerInfoService;
  SuperMap.SetLayersInfoParameters = SetLayersInfoParameters;
  SuperMap.SetLayersInfoService = SetLayersInfoService;
  SuperMap.SetLayerStatusParameters = SetLayerStatusParameters;
  SuperMap.SetLayerStatusService = SetLayerStatusService;
  SuperMap.SingleObjectQueryJobsParameter = SingleObjectQueryJobsParameter;
  SuperMap.SingleObjectQueryJobsService = SingleObjectQueryJobsService;
  SuperMap.Sortby = Sortby || {};
  SuperMap.Sortby.Direction = {
    ASC: 'ASC',
    DESC: 'DESC'
  };
  SuperMap.SpatialAnalystBase = SpatialAnalystBase;
  SuperMap.StopQueryParameters = StopQueryParameters;
  SuperMap.StopQueryService = StopQueryService;
  SuperMap.SummaryAttributesJobsParameter = SummaryAttributesJobsParameter;
  SuperMap.SummaryAttributesJobsService = SummaryAttributesJobsService;
  SuperMap.SummaryMeshJobParameter = SummaryMeshJobParameter;
  SuperMap.SummaryMeshJobsService = SummaryMeshJobsService;
  SuperMap.SummaryRegionJobParameter = SummaryRegionJobParameter;
  SuperMap.SummaryRegionJobsService = SummaryRegionJobsService;
  SuperMap.SupplyCenter = SupplyCenter;
  SuperMap.SurfaceAnalystParameters = SurfaceAnalystParameters;
  SuperMap.SurfaceAnalystParametersSetting = SurfaceAnalystParametersSetting;
  SuperMap.SurfaceAnalystService = SurfaceAnalystService;
  SuperMap.TerrainCurvatureCalculationParameters = TerrainCurvatureCalculationParameters;
  SuperMap.TerrainCurvatureCalculationService = TerrainCurvatureCalculationService;
  SuperMap.Theme = Theme;
  SuperMap.ThemeDotDensity = ThemeDotDensity;
  SuperMap.ThemeFlow = ThemeFlow;
  SuperMap.ThemeGraduatedSymbol = ThemeGraduatedSymbol;
  SuperMap.ThemeGraduatedSymbolStyle = ThemeGraduatedSymbolStyle;
  SuperMap.ThemeGraph = ThemeGraph;
  SuperMap.ThemeGraphAxes = ThemeGraphAxes;
  SuperMap.ThemeGraphItem = ThemeGraphItem;
  SuperMap.ThemeGraphSize = ThemeGraphSize;
  SuperMap.ThemeGraphText = ThemeGraphText;
  SuperMap.ThemeGridRange = ThemeGridRange;
  SuperMap.ThemeGridRangeItem = ThemeGridRangeItem;
  SuperMap.ThemeGridUnique = ThemeGridUnique;
  SuperMap.ThemeGridUniqueItem = ThemeGridUniqueItem;
  SuperMap.ThemeLabel = ThemeLabel;
  SuperMap.ThemeLabelAlongLine = ThemeLabelAlongLine;
  SuperMap.ThemeLabelBackground = ThemeLabelBackground;
  SuperMap.ThemeLabelItem = ThemeLabelItem;
  SuperMap.ThemeLabelText = ThemeLabelText;
  SuperMap.ThemeLabelUniqueItem = ThemeLabelUniqueItem;
  SuperMap.ThemeMemoryData = ThemeMemoryData;
  SuperMap.ThemeOffset = ThemeOffset;
  SuperMap.ThemeParameters = ThemeParameters;
  SuperMap.ThemeRange = ThemeRange;
  SuperMap.ThemeRangeItem = ThemeRangeItem;
  SuperMap.ThemeService = ThemeService;
  SuperMap.ThemeUnique = ThemeUnique;
  SuperMap.ThemeUniqueItem = ThemeUniqueItem;
  SuperMap.ThiessenAnalystParameters = ThiessenAnalystParameters;
  SuperMap.ThiessenAnalystService = ThiessenAnalystService;
  SuperMap.TilesetsService = TilesetsService;
  SuperMap.TopologyValidatorJobsParameter = TopologyValidatorJobsParameter;
  SuperMap.TopologyValidatorJobsService = TopologyValidatorJobsService;
  SuperMap.TransferLine = TransferLine;
  SuperMap.TransferPathParameters = TransferPathParameters;
  SuperMap.TransferPathService = TransferPathService;
  SuperMap.TransferSolutionParameters = TransferSolutionParameters;
  SuperMap.TransferSolutionService = TransferSolutionService;
  SuperMap.TransportationAnalystParameter = TransportationAnalystParameter;
  SuperMap.TransportationAnalystResultSetting = TransportationAnalystResultSetting;
  SuperMap.UGCLayer = UGCLayer;
  SuperMap.UGCMapLayer = UGCMapLayer;
  SuperMap.UGCSubLayer = UGCSubLayer;
  SuperMap.UpdateDatasetParameters = UpdateDatasetParameters;
  SuperMap.UpdateEdgeWeightParameters = UpdateEdgeWeightParameters;
  SuperMap.UpdateEdgeWeightService = UpdateEdgeWeightService;
  SuperMap.UpdateTurnNodeWeightParameters = UpdateTurnNodeWeightParameters;
  SuperMap.UpdateTurnNodeWeightService = UpdateTurnNodeWeightService;
  SuperMap.Vector = Vector;
  SuperMap.VectorClipJobsParameter = VectorClipJobsParameter;
  SuperMap.VectorClipJobsService = VectorClipJobsService;
  SuperMap.WebPrintingJobCustomItems = WebPrintingJobCustomItems;
  SuperMap.WebPrintingJobExportOptions = WebPrintingJobExportOptions;
  SuperMap.WebPrintingJobImage = WebPrintingJobImage;
  SuperMap.WebPrintingJobLayers = WebPrintingJobLayers;
  SuperMap.WebPrintingJobLayoutOptions = WebPrintingJobLayoutOptions;
  SuperMap.WebPrintingJobLegendOptions = WebPrintingJobLegendOptions;
  SuperMap.WebPrintingJobLittleMapOptions = WebPrintingJobLittleMapOptions;
  SuperMap.WebPrintingJobNorthArrowOptions = WebPrintingJobNorthArrowOptions;
  SuperMap.WebPrintingJobParameters = WebPrintingJobParameters;
  SuperMap.WebPrintingJobScaleBarOptions = WebPrintingJobScaleBarOptions;
  SuperMap.WebPrintingService = WebPrintingService;
  //Online
  SuperMap.Online = Online;
  SuperMap.OnlineData = OnlineData;
  SuperMap.OnlineQueryDatasParameter = OnlineQueryDatasParameter;
  SuperMap.ServiceStatus = ServiceStatus;
  SuperMap.DataItemType = DataItemType;
  SuperMap.DataItemOrderBy = DataItemOrderBy;
  SuperMap.FilterField = FilterField;
  SuperMap.OnlineServiceBase = OnlineServiceBase;
  // overlay
  SuperMap.Feature = SuperMap.Feature || {};
  SuperMap.Feature.Theme = FeatureTheme;
  SuperMap.Feature.Theme.Bar = Bar;
  SuperMap.Feature.Theme.Bar3D = Bar3D;
  SuperMap.Feature.Theme.Circle = Circle;
  SuperMap.Feature.Theme.Graph = Graph;
  SuperMap.Feature.Theme.Line = Line;
  SuperMap.Feature.Theme.Pie = Pie;
  SuperMap.Feature.Theme.Point = OverlayPoint;
  SuperMap.Feature.Theme.RankSymbol = RankSymbol;
  SuperMap.Feature.Theme.Ring = Ring;
  SuperMap.Feature.Theme.ThemeVector = ThemeVector;
  SuperMap.Feature.ShapeParameters = ShapeParameters;
  SuperMap.Feature.ShapeParameters.Circle = FeatureCircle;
  SuperMap.Feature.ShapeParameters.Image = Image;
  SuperMap.Feature.ShapeParameters.Label = Label;
  SuperMap.Feature.ShapeParameters.Line = FeatureLine;
  SuperMap.Feature.ShapeParameters.Point = Point;
  SuperMap.Feature.ShapeParameters.Polygon = FeaturePolygon;
  SuperMap.Feature.ShapeParameters.Rectangle = FeatureRectangle;
  SuperMap.Feature.ShapeParameters.Sector = Sector;
  SuperMap.Feature.ShapeFactory = ShapeFactory;
  // LevelRenderer
  SuperMap.LevelRenderer = LevelRenderer;

  // security
  SuperMap.KeyServiceParameter = KeyServiceParameter;
  SuperMap.SecurityManager = SecurityManager;
  SuperMap.ServerInfo = ServerInfo;
  SuperMap.TokenServiceParameter = TokenServiceParameter;
  // style
  SuperMap.ThemeStyle = ThemeStyle;
  // thirdparty
  SuperMap.BinaryClassification = BinaryClassification;
  SuperMap.LandcoverClassification = LandcoverClassification;
  SuperMap.ObjectDetection = ObjectDetection;
  SuperMap.WebMachineLearning = WebMachineLearning;
  SuperMap.ElasticSearch = ElasticSearch;
  // util
  SuperMap.ArrayStatistic = ArrayStatistic;
  SuperMap.ColorsPickerUtil = ColorsPickerUtil;

  // REST
  SuperMap.DataFormat = DataFormat;
  SuperMap.ServerType = ServerType;
  SuperMap.GeometryType = GeometryType;
  SuperMap.QueryOption = QueryOption;
  SuperMap.JoinType = JoinType;
  SuperMap.SpatialQueryMode = SpatialQueryMode;
  SuperMap.SpatialRelationType = SpatialRelationType;
  SuperMap.MeasureMode = MeasureMode;
  SuperMap.Unit = Unit;
  SuperMap.BufferRadiusUnit = BufferRadiusUnit;
  SuperMap.EngineType = EngineType;
  SuperMap.ThemeGraphTextFormat = ThemeGraphTextFormat;
  SuperMap.ThemeGraphType = ThemeGraphType;
  SuperMap.GraphAxesTextDisplayMode = GraphAxesTextDisplayMode;
  SuperMap.GraduatedMode = GraduatedMode;
  SuperMap.RangeMode = RangeMode;
  SuperMap.ThemeType = ThemeType;
  SuperMap.ColorGradientType = ColorGradientType;
  SuperMap.TextAlignment = TextAlignment;
  SuperMap.FillGradientMode = FillGradientMode;
  SuperMap.AlongLineDirection = AlongLineDirection;
  SuperMap.LabelBackShape = LabelBackShape;
  SuperMap.LabelOverLengthMode = LabelOverLengthMode;
  SuperMap.DirectionType = DirectionType;
  SuperMap.OverlayOperationType = OverlayOperationType;
  SuperMap.SideType = SideType;
  SuperMap.SupplyCenterType = SupplyCenterType;
  SuperMap.TurnType = TurnType;
  SuperMap.BufferEndType = BufferEndType;
  SuperMap.SmoothMethod = SmoothMethod;
  SuperMap.SurfaceAnalystMethod = SurfaceAnalystMethod;
  SuperMap.DataReturnMode = DataReturnMode;
  SuperMap.EditType = EditType;
  SuperMap.TransferTactic = TransferTactic;
  SuperMap.TransferPreference = TransferPreference;
  SuperMap.GridType = GridType;
  SuperMap.ColorSpaceType = ColorSpaceType;
  SuperMap.LayerType = LayerType;
  SuperMap.UGCLayerType = UGCLayerType;
  SuperMap.StatisticMode = StatisticMode;
  SuperMap.PixelFormat = PixelFormat;
  SuperMap.SearchMode = SearchMode;
  SuperMap.InterpolationAlgorithmType = InterpolationAlgorithmType;
  SuperMap.VariogramMode = VariogramMode;
  SuperMap.Exponent = Exponent;
  SuperMap.ClientType = ClientType;
  SuperMap.ChartType = ChartType;
  SuperMap.ClipAnalystMode = ClipAnalystMode;
  SuperMap.AnalystAreaUnit = AnalystAreaUnit;
  SuperMap.AnalystSizeUnit = AnalystSizeUnit;
  SuperMap.StatisticAnalystMode = StatisticAnalystMode;
  SuperMap.SummaryType = SummaryType;
  SuperMap.TopologyValidatorRule = TopologyValidatorRule;
  SuperMap.BucketAggType = BucketAggType;
  SuperMap.MetricsAggType = MetricsAggType;
  SuperMap.GetFeatureMode = GetFeatureMode;
  SuperMap.RasterFunctionType = RasterFunctionType;
  SuperMap.ResourceType = ResourceType;
  SuperMap.OrderBy = OrderBy;
  SuperMap.OrderType = OrderType;
  SuperMap.SearchType = SearchType;
  SuperMap.AggregationTypes = AggregationTypes;
  SuperMap.PermissionType = PermissionType;
  SuperMap.EntityType = EntityType;
  SuperMap.REST_DataItemType = REST_DataItemType;
  SuperMap.WebExportFormatType = WebExportFormatType;
  SuperMap.WebScaleOrientationType = WebScaleOrientationType;
  SuperMap.WebScaleType = WebScaleType;
  SuperMap.WebScaleUnit = WebScaleUnit;
}

export {
  FileTypes,
  FileConfig,
  FileModel,
  MessageBox,
  CommonContainer,
  DropDownBox,
  Select,
  AttributesPopContainer,
  PopContainer,
  IndexTabsPageContainer,
  CityTabsPage,
  NavTabsPage,
  PaginationContainer,
  ComponentsUtil,
  FileReaderUtil,
  ChartView,
  ChartViewModel
};
export { SuperMap };
export {
  DataFormat,
  ServerType,
  GeometryType,
  QueryOption,
  JoinType,
  EngineType,
  MeasureMode,
  SpatialRelationType,
  DataReturnMode,
  Unit,
  BufferRadiusUnit,
  SpatialQueryMode,
  ThemeGraphTextFormat,
  ThemeGraphType,
  GraphAxesTextDisplayMode,
  GraduatedMode,
  RangeMode,
  ThemeType,
  ColorGradientType,
  TextAlignment,
  FillGradientMode,
  SideType,
  AlongLineDirection,
  LabelBackShape,
  LabelOverLengthMode,
  DirectionType,
  OverlayOperationType,
  SupplyCenterType,
  TurnType,
  BufferEndType,
  SmoothMethod,
  SurfaceAnalystMethod,
  ColorSpaceType,
  ChartType,
  EditType,
  TransferTactic,
  TransferPreference,
  GridType,
  ClientType,
  LayerType,
  UGCLayerType,
  StatisticMode,
  PixelFormat,
  SearchMode,
  SummaryType,
  InterpolationAlgorithmType,
  VariogramMode,
  Exponent,
  ClipAnalystMode,
  AnalystAreaUnit,
  AnalystSizeUnit,
  StatisticAnalystMode,
  TopologyValidatorRule,
  OutputType,
  MetricsAggType,
  BucketAggType,
  GetFeatureMode,
  RasterFunctionType
};
export {
  Collection,
  Curve,
  GeoText,
  LinearRing,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  GeometryPoint,
  Polygon,
  Rectangle,
  StringExt,
  NumberExt,
  FunctionExt,
  ArrayExt,
  Bounds,
  Credential,
  DateExt,
  Event,
  Events,
  Feature,
  Geometry,
  LonLat,
  Pixel,
  Size,
  CommonUtil,
  GeometryVector
};
export { TimeControlBase, TimeFlowControl };
export { Format, GeoJSON, JSONFormat, WKT };
export {
  setCORS,
  isCORS,
  setRequestTimeout,
  getRequestTimeout,
  FetchRequest,
  ColorsPickerUtil,
  ArrayStatistic,
  getMeterPerMapUnit,
  getWrapNum,
  conversionDegree
};
export { IManager, IManagerCreateNodeParam, IManagerServiceBase };
export {
  IPortal,
  IPortalQueryParam,
  IPortalResource,
  IPortalQueryResult,
  IPortalShareParam,
  IPortalShareEntity,
  IPortalServiceBase,
  IPortalUser,
  IPortalAddResourceParam,
  IPortalRegisterServiceParam,
  IPortalAddDataParam,
  IPortalDataMetaInfoParam,
  IPortalDataStoreInfoParam,
  IPortalDataConnectionInfoParam
};
export {
  AddressMatchService,
  AggregationParameter,
  BucketAggParameter,
  MetricsAggParameter,
  AreaSolarRadiationParameters,
  AreaSolarRadiationService,
  BufferAnalystParameters,
  BufferAnalystService,
  BufferDistance,
  BufferSetting,
  BuffersAnalystJobsParameter,
  BuffersAnalystJobsService,
  BurstPipelineAnalystParameters,
  BurstPipelineAnalystService,
  ChartFeatureInfoSpecsService,
  ChartQueryFilterParameter,
  ChartQueryParameters,
  ChartQueryService,
  ClipParameter,
  ColorDictionary,
  CommonServiceBase,
  ComputeWeightMatrixParameters,
  ComputeWeightMatrixService,
  DataFlowService,
  DataReturnOption,
  DatasetBufferAnalystParameters,
  DatasetInfo,
  DatasetOverlayAnalystParameters,
  DatasetService,
  DatasetSurfaceAnalystParameters,
  DatasetThiessenAnalystParameters,
  DatasourceConnectionInfo,
  DatasourceService,
  DensityAnalystService,
  DensityKernelAnalystParameters,
  EditFeaturesParameters,
  EditFeaturesService,
  FacilityAnalyst3DParameters,
  FacilityAnalystSinks3DParameters,
  FacilityAnalystSinks3DService,
  FacilityAnalystSources3DParameters,
  FacilityAnalystSources3DService,
  FacilityAnalystStreamParameters,
  FacilityAnalystStreamService,
  FacilityAnalystTracedown3DParameters,
  FacilityAnalystTracedown3DService,
  FacilityAnalystTraceup3DParameters,
  FacilityAnalystTraceup3DService,
  FacilityAnalystUpstream3DParameters,
  FacilityAnalystUpstream3DService,
  FieldParameters,
  FieldStatisticService,
  FieldStatisticsParameters,
  FilterParameter,
  FindClosestFacilitiesParameters,
  FindClosestFacilitiesService,
  FindLocationParameters,
  FindLocationService,
  FindMTSPPathsParameters,
  FindMTSPPathsService,
  FindPathParameters,
  FindPathService,
  FindServiceAreasParameters,
  FindServiceAreasService,
  FindTSPPathsParameters,
  FindTSPPathsService,
  GenerateSpatialDataParameters,
  GenerateSpatialDataService,
  GeoCodingParameter,
  GeoDecodingParameter,
  GeoHashGridAggParameter,
  GeometryBufferAnalystParameters,
  GeometryOverlayAnalystParameters,
  GeometrySurfaceAnalystParameters,
  GeometryThiessenAnalystParameters,
  GeoRelationAnalystParameters,
  GeoRelationAnalystService,
  GetFeaturesByBoundsParameters,
  GetFeaturesByBoundsService,
  GetFeaturesByBufferParameters,
  GetFeaturesByBufferService,
  GetFeaturesByGeometryParameters,
  GetFeaturesByGeometryService,
  GetFeaturesByIDsParameters,
  GetFeaturesByIDsService,
  GetFeaturesBySQLParameters,
  GetFeaturesBySQLService,
  GetFeaturesParametersBase,
  GetFeaturesServiceBase,
  GetFieldsService,
  GetGridCellInfosParameters,
  GetGridCellInfosService,
  GetLayersInfoService,
  Grid,
  UGCImage,
  InterpolationAnalystParameters,
  InterpolationAnalystService,
  InterpolationIDWAnalystParameters,
  InterpolationKrigingAnalystParameters,
  InterpolationRBFAnalystParameters,
  JoinItem,
  KernelDensityJobParameter,
  KernelDensityJobsService,
  LabelImageCell,
  LabelMatrixCell,
  LabelMixedTextStyle,
  LabelSymbolCell,
  LabelThemeCell,
  LayerStatus,
  LinkItem,
  MapService,
  MathExpressionAnalysisParameters,
  MathExpressionAnalysisService,
  MeasureParameters,
  MeasureService,
  NetworkAnalystServiceBase,
  OutputSetting,
  MappingParameters,
  OverlapDisplayedOptions,
  OverlayAnalystParameters,
  OverlayAnalystService,
  OverlayGeoJobParameter,
  OverlayGeoJobsService,
  PointWithMeasure,
  ProcessingServiceBase,
  QueryByBoundsParameters,
  QueryByBoundsService,
  QueryByDistanceParameters,
  QueryByDistanceService,
  QueryByGeometryParameters,
  QueryByGeometryService,
  QueryBySQLParameters,
  QueryBySQLService,
  QueryParameters,
  QueryService,
  Route,
  RouteCalculateMeasureParameters,
  RouteCalculateMeasureService,
  RouteLocatorParameters,
  RouteLocatorService,
  ServerColor,
  ServerFeature,
  ServerGeometry,
  ServerStyle,
  ServerTextStyle,
  ServerTheme,
  SetDatasourceParameters,
  SetLayerInfoParameters,
  SetLayerInfoService,
  SetLayersInfoParameters,
  SetLayersInfoService,
  SetLayerStatusParameters,
  SetLayerStatusService,
  SingleObjectQueryJobsParameter,
  SingleObjectQueryJobsService,
  SpatialAnalystBase,
  StopQueryParameters,
  StopQueryService,
  SummaryAttributesJobsParameter,
  SummaryAttributesJobsService,
  SummaryMeshJobParameter,
  SummaryMeshJobsService,
  SummaryRegionJobParameter,
  SummaryRegionJobsService,
  SupplyCenter,
  SurfaceAnalystParameters,
  SurfaceAnalystParametersSetting,
  SurfaceAnalystService,
  TerrainCurvatureCalculationParameters,
  TerrainCurvatureCalculationService,
  Theme,
  ThemeDotDensity,
  ThemeFlow,
  ThemeGraduatedSymbol,
  ThemeGraduatedSymbolStyle,
  ThemeGraph,
  ThemeGraphAxes,
  ThemeGraphItem,
  ThemeGraphSize,
  ThemeGraphText,
  ThemeGridRange,
  ThemeGridRangeItem,
  ThemeGridUnique,
  ThemeGridUniqueItem,
  ThemeLabel,
  ThemeLabelAlongLine,
  ThemeLabelBackground,
  ThemeLabelItem,
  ThemeLabelText,
  ThemeLabelUniqueItem,
  ThemeMemoryData,
  ThemeOffset,
  ThemeParameters,
  ThemeRange,
  ThemeRangeItem,
  ThemeService,
  ThemeUnique,
  ThemeUniqueItem,
  ThiessenAnalystParameters,
  ThiessenAnalystService,
  GeometryBatchAnalystService,
  TilesetsService,
  TopologyValidatorJobsParameter,
  TopologyValidatorJobsService,
  TransferLine,
  TransferPathParameters,
  TransferPathService,
  TransferSolutionService,
  TransportationAnalystParameter,
  TransportationAnalystResultSetting,
  TransferSolutionParameters,
  UGCLayer,
  UGCMapLayer,
  UGCSubLayer,
  UpdateEdgeWeightParameters,
  UpdateEdgeWeightService,
  UpdateTurnNodeWeightParameters,
  UpdateTurnNodeWeightService,
  UpdateDatasetParameters,
  CreateDatasetParameters,
  Vector,
  VectorClipJobsParameter,
  VectorClipJobsService,
  RasterFunctionParameter,
  NDVIParameter,
  HillshadeParameter,
  WebPrintingJobCustomItems,
  WebPrintingJobImage,
  WebPrintingJobLayers,
  WebPrintingJobLegendOptions,
  WebPrintingJobLittleMapOptions,
  WebPrintingJobNorthArrowOptions,
  WebPrintingJobScaleBarOptions,
  WebPrintingJobContent,
  WebPrintingJobLayoutOptions,
  WebPrintingJobExportOptions,
  WebPrintingJobParameters,
  WebPrintingService,
  FieldsFilter,
  ImageGFAspect,
  ImageGFHillShade,
  ImageGFOrtho,
  ImageGFSlope,
  ImageSearchParameter,
  ImageRenderingRule,
  Sortby,
  ImageStretchOption,
  ImageCollectionService,
  ImageService
};
export {
  Online,
  OnlineData,
  OnlineQueryDatasParameter,
  ServiceStatus,
  DataItemType,
  DataItemOrderBy,
  FilterField,
  OnlineServiceBase
};
export {
  Bar,
  Bar3D,
  Circle,
  Graph,
  Line,
  Pie,
  OverlayPoint,
  RankSymbol,
  Ring,
  ThemeVector,
  ShapeFactory,
  ShapeParameters,
  FeatureCircle,
  Image,
  Label,
  FeatureLine,
  Point,
  FeaturePolygon,
  FeatureRectangle,
  Sector,
  FeatureTheme,
  LevelRenderer,
  Render,
  Animation,
  Animator,
  Area,
  Clip,
  Color,
  ComputeBoundingBox,
  Config,
  LevelRendererCurve,
  Easing,
  Env,
  LevelRendererEvent,
  Eventful,
  Group,
  Handler,
  Http,
  Log,
  MathTool,
  Matrix,
  Painter,
  PaintLayer,
  Shape,
  SmicBrokenLine,
  SmicCircle,
  SmicEllipse,
  SmicImage,
  SmicIsogon,
  SmicPoint,
  SmicPolygon,
  SmicRectangle,
  SmicRing,
  SmicSector,
  SmicStar,
  SmicText,
  Storage,
  Transformable,
  Util,
  LevelRendererVector,
  SUtil
};
export { KeyServiceParameter, SecurityManager, ServerInfo, TokenServiceParameter };
export { CartoCSS, ThemeStyle };
export { ElasticSearch };
export { Lang, en, zh };
