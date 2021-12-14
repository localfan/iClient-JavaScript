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
    WebExportFormatType,
    WebScaleOrientationType,
    WebScaleType,
    WebScaleUnit,
    DataItemType
} from './REST';
import {
    GeometryCollection,
    GeometryCurve,
    GeometryGeoText,
    GeometryLinearRing,
    GeometryLineString,
    GeometryMultiLineString,
    GeometryMultiPoint,
    GeometryMultiPolygon,
    GeometryPoint,
    GeometryPolygon,
    GeometryRectangle,
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
    Browser,
    FeatureVector
} from './commontypes';
import { Format, GeoJSONFormat, JSONFormat } from './format';

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
    AggregationParameter,
    BucketAggParameter,
    MetricsAggParameter,
    AreaSolarRadiationParameters,
    BufferAnalystParameters,
    BufferDistance,
    BufferSetting,
    BuffersAnalystJobsParameter,
    BurstPipelineAnalystParameters,
    ChartQueryFilterParameter,
    ChartQueryParameters,
    ClipParameter,
    ColorDictionary,
    CommonServiceBase,
    ComputeWeightMatrixParameters,
    DataReturnOption,
    DatasetBufferAnalystParameters,
    DatasetInfo,
    DatasetOverlayAnalystParameters,
    DatasetSurfaceAnalystParameters,
    DatasetThiessenAnalystParameters,
    DatasourceConnectionInfo,
    DensityKernelAnalystParameters,
    EditFeaturesParameters,
    FacilityAnalyst3DParameters,
    FacilityAnalystSinks3DParameters,
    FacilityAnalystSources3DParameters,
    FacilityAnalystStreamParameters,
    FacilityAnalystTracedown3DParameters,
    FacilityAnalystTraceup3DParameters,
    FacilityAnalystUpstream3DParameters,
    FieldParameters,
    FieldStatisticsParameters,
    FilterParameter,
    FindClosestFacilitiesParameters,
    FindLocationParameters,
    FindMTSPPathsParameters,
    FindPathParameters,
    FindServiceAreasParameters,
    FindTSPPathsParameters,
    GenerateSpatialDataParameters,
    GeoCodingParameter,
    GeoDecodingParameter,
    GeoHashGridAggParameter,
    GeometryBufferAnalystParameters,
    GeometryOverlayAnalystParameters,
    GeometrySurfaceAnalystParameters,
    GeometryThiessenAnalystParameters,
    GeoRelationAnalystParameters,
    GetFeaturesByBoundsParameters,
    GetFeaturesByBufferParameters,
    GetFeaturesByGeometryParameters,
    GetFeaturesByIDsParameters,
    GetFeaturesBySQLParameters,
    GetFeaturesParametersBase,
    GetFeaturesServiceBase,
    GetGridCellInfosParameters,
    Grid,
    InterpolationAnalystParameters,
    InterpolationDensityAnalystParameters,
    InterpolationIDWAnalystParameters,
    InterpolationKrigingAnalystParameters,
    InterpolationRBFAnalystParameters,
    JoinItem,
    KernelDensityJobParameter,
    LabelImageCell,
    LabelMatrixCell,
    LabelMixedTextStyle,
    LabelSymbolCell,
    LabelThemeCell,
    LayerStatus,
    LinkItem,
    MathExpressionAnalysisParameters,
    MeasureParameters,
    NetworkAnalystServiceBase,
    OutputSetting,
    MappingParameters,
    OverlapDisplayedOptions,
    OverlayAnalystParameters,
    OverlayGeoJobParameter,
    PointWithMeasure,
    ProcessingServiceBase,
    QueryByBoundsParameters,
    QueryByDistanceParameters,
    QueryByGeometryParameters,
    QueryBySQLParameters,
    QueryParameters,
    Route,
    RouteCalculateMeasureParameters,
    RouteLocatorParameters,
    ServerColor,
    ServerFeature,
    ServerGeometry,
    ServerStyle,
    ServerTextStyle,
    ServerTheme,
    SetDatasourceParameters,
    SetLayerInfoParameters,
    SetLayersInfoParameters,
    SetLayerStatusParameters,
    SingleObjectQueryJobsParameter,
    SpatialAnalystBase,
    StopQueryParameters,
    SummaryAttributesJobsParameter,
    SummaryMeshJobParameter,
    SummaryRegionJobParameter,
    SupplyCenter,
    SurfaceAnalystParameters,
    SurfaceAnalystParametersSetting,
    TerrainCurvatureCalculationParameters,
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
    ThemeUnique,
    ThemeUniqueItem,
    ThiessenAnalystParameters,
    TopologyValidatorJobsParameter,
    TransferLine,
    TransferPathParameters,
    TransportationAnalystParameter,
    TransportationAnalystResultSetting,
    TransferSolutionParameters,
    UGCLayer,
    UGCMapLayer,
    UGCSubLayer,
    UpdateEdgeWeightParameters,
    UpdateTurnNodeWeightParameters,
    UpdateDatasetParameters,
    CreateDatasetParameters,
    Vector,
    VectorClipJobsParameter,
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
    FieldsFilter,
    ImageGFAspect,
    ImageGFHillShade,
    ImageGFOrtho,
    ImageGFSlope,
    ImageSearchParameter,
    ImageRenderingRule,
    Sortby,
    ImageStretchOption
} from './iServer';
import {
    Online,
    OnlineData,
    OnlineQueryDatasParameter,
    ServiceStatus,
    DataItemOrderBy,
    FilterField,
    OnlineServiceBase
} from './online';
import { KeyServiceParameter, SecurityManager, ServerInfo, TokenServiceParameter } from './security';
import { ElasticSearch } from './thirdparty';
import {
    isCORS,
    FetchRequest,
    ColorsPickerUtil,
    ArrayStatistic,
    getMeterPerMapUnit,
    getWrapNum,
    conversionDegree
} from './util';
import { CartoCSS, ThemeStyle } from './style';
import {
    FeatureThemeGraph,
    FeatureThemeRankSymbol,
    FeatureThemeVector,
    FeatureShapeFactory,
    ShapeParameters,
    ShapeParametersImage,
    ShapeParametersLabel,
    ShapeParametersLine,
    ShapeParametersPolygon,
    ShapeParametersRectangle,
    ShapeParametersSector,
    FeatureTheme,
    LevelRenderer,
    Render,
    Color,
    Shape,
    SmicBrokenLine,
    SmicCircle,
    SmicEllipse,
    SmicImage,
    SmicPoint,
    SmicPolygon,
    SmicRectangle,
    SmicSector,
    SmicText,
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
    AttributesPopContainer,
    PopContainer,
    IndexTabsPageContainer,
    CityTabsPage,
    NavTabsPage,
    PaginationContainer,
    ComponentsUtil,
    FileReaderUtil,
    ChartView,
    ChartViewModel,
    TemplateBase
} from './components';
import { Lang } from './lang';

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
    ChartViewModel,
    TemplateBase
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
    RasterFunctionType,
    ResourceType,
    OrderBy,
    OrderType,
    SearchType,
    AggregationTypes,
    PermissionType,
    EntityType,
    WebExportFormatType,
    WebScaleOrientationType,
    WebScaleType,
    WebScaleUnit,
    DataItemType
};
export {
    GeometryCollection,
    GeometryCurve,
    GeometryGeoText,
    GeometryLinearRing,
    GeometryLineString,
    GeometryMultiLineString,
    GeometryMultiPoint,
    GeometryMultiPolygon,
    GeometryPoint,
    GeometryPolygon,
    GeometryRectangle,
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
    Browser,
    FeatureVector
};
export { TimeControlBase, TimeFlowControl };
export { Format, GeoJSONFormat, JSONFormat };
export {
    isCORS,
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
    AggregationParameter,
    BucketAggParameter,
    MetricsAggParameter,
    AreaSolarRadiationParameters,
    BufferAnalystParameters,
    BufferDistance,
    BufferSetting,
    BuffersAnalystJobsParameter,
    BurstPipelineAnalystParameters,
    ChartQueryFilterParameter,
    ChartQueryParameters,
    ClipParameter,
    ColorDictionary,
    CommonServiceBase,
    ComputeWeightMatrixParameters,
    DataReturnOption,
    DatasetBufferAnalystParameters,
    DatasetInfo,
    DatasetOverlayAnalystParameters,
    DatasetSurfaceAnalystParameters,
    DatasetThiessenAnalystParameters,
    DatasourceConnectionInfo,
    DensityKernelAnalystParameters,
    EditFeaturesParameters,
    FacilityAnalyst3DParameters,
    FacilityAnalystSinks3DParameters,
    FacilityAnalystSources3DParameters,
    FacilityAnalystStreamParameters,
    FacilityAnalystTracedown3DParameters,
    FacilityAnalystTraceup3DParameters,
    FacilityAnalystUpstream3DParameters,
    FieldParameters,
    FieldStatisticsParameters,
    FilterParameter,
    FindClosestFacilitiesParameters,
    FindLocationParameters,
    FindMTSPPathsParameters,
    FindPathParameters,
    FindServiceAreasParameters,
    FindTSPPathsParameters,
    GenerateSpatialDataParameters,
    GeoCodingParameter,
    GeoDecodingParameter,
    GeoHashGridAggParameter,
    GeometryBufferAnalystParameters,
    GeometryOverlayAnalystParameters,
    GeometrySurfaceAnalystParameters,
    GeometryThiessenAnalystParameters,
    GeoRelationAnalystParameters,
    GetFeaturesByBoundsParameters,
    GetFeaturesByBufferParameters,
    GetFeaturesByGeometryParameters,
    GetFeaturesByIDsParameters,
    GetFeaturesBySQLParameters,
    GetFeaturesParametersBase,
    GetFeaturesServiceBase,
    GetGridCellInfosParameters,
    Grid,
    InterpolationAnalystParameters,
    InterpolationDensityAnalystParameters,
    InterpolationIDWAnalystParameters,
    InterpolationKrigingAnalystParameters,
    InterpolationRBFAnalystParameters,
    JoinItem,
    KernelDensityJobParameter,
    LabelImageCell,
    LabelMatrixCell,
    LabelMixedTextStyle,
    LabelSymbolCell,
    LabelThemeCell,
    LayerStatus,
    LinkItem,
    MathExpressionAnalysisParameters,
    MeasureParameters,
    NetworkAnalystServiceBase,
    OutputSetting,
    MappingParameters,
    OverlapDisplayedOptions,
    OverlayAnalystParameters,
    OverlayGeoJobParameter,
    PointWithMeasure,
    ProcessingServiceBase,
    QueryByBoundsParameters,
    QueryByDistanceParameters,
    QueryByGeometryParameters,
    QueryBySQLParameters,
    QueryParameters,
    Route,
    RouteCalculateMeasureParameters,
    RouteLocatorParameters,
    ServerColor,
    ServerFeature,
    ServerGeometry,
    ServerStyle,
    ServerTextStyle,
    ServerTheme,
    SetDatasourceParameters,
    SetLayerInfoParameters,
    SetLayersInfoParameters,
    SetLayerStatusParameters,
    SingleObjectQueryJobsParameter,
    SpatialAnalystBase,
    StopQueryParameters,
    SummaryAttributesJobsParameter,
    SummaryMeshJobParameter,
    SummaryRegionJobParameter,
    SupplyCenter,
    SurfaceAnalystParameters,
    SurfaceAnalystParametersSetting,
    TerrainCurvatureCalculationParameters,
    Theme as CommonTheme,
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
    ThemeUnique,
    ThemeUniqueItem,
    ThiessenAnalystParameters,
    TopologyValidatorJobsParameter,
    TransferLine,
    TransferPathParameters,   
    TransportationAnalystParameter,
    TransportationAnalystResultSetting,
    TransferSolutionParameters,
    UGCLayer,
    UGCMapLayer,
    UGCSubLayer,
    UpdateEdgeWeightParameters,
    UpdateTurnNodeWeightParameters,
    UpdateDatasetParameters,
    CreateDatasetParameters,
    Vector,
    VectorClipJobsParameter,
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
    FieldsFilter,
    ImageGFAspect,
    ImageGFHillShade,
    ImageGFOrtho,
    ImageGFSlope,
    ImageSearchParameter,
    ImageRenderingRule,
    Sortby,
    ImageStretchOption
};
export {
    Online,
    OnlineData,
    OnlineQueryDatasParameter,
    ServiceStatus,
    DataItemOrderBy,
    FilterField,
    OnlineServiceBase
};
export {
    FeatureThemeGraph,
    FeatureThemeRankSymbol,
    FeatureThemeVector,
    FeatureShapeFactory,
    ShapeParameters,
    ShapeParametersImage,
    ShapeParametersLabel,
    ShapeParametersLine,
    ShapeParametersPolygon,
    ShapeParametersRectangle,
    ShapeParametersSector,
    FeatureTheme,
    LevelRenderer,
    Render,
    Color,
    Shape,
    SmicBrokenLine,
    SmicCircle,
    SmicEllipse,
    SmicImage,
    SmicPoint,
    SmicPolygon,
    SmicRectangle,
    SmicSector,
    SmicText,
    SUtil
};
export { KeyServiceParameter, SecurityManager, ServerInfo, TokenServiceParameter };
export { CartoCSS, ThemeStyle };
export { ElasticSearch };
export { Lang };
