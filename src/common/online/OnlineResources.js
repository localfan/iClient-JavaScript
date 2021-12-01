/* Copyright© 2000 - 2021 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/

/**
 * @enum ServiceStatus
 * @category iPortal/Online
 * @description 服务发布状态。
 */
var ServiceStatus = {
    /** 不涉及，不可发布。 */
    DOES_NOT_INVOLVE: "DOES_NOT_INVOLVE",
    /** 发布失败。 */
    PUBLISH_FAILED: "PUBLISH_FAILED",
    /** 已发布。 */
    PUBLISHED: "PUBLISHED",
    /** 正在发布。 */
    PUBLISHING: "PUBLISHING",
    /** 未发布。 */
    UNPUBLISHED: "UNPUBLISHED",
    /** 取消服务失败。 */
    UNPUBLISHED_FAILED: "UNPUBLISHED_FAILED"
};


/**
 * @enum DataItemOrderBy
 * @category iPortal/Online
 * @description 数据排序字段。
 */
var DataItemOrderBy = {
    /** FILENAME */
    FILENAME: "FILENAME",
    /** ID */
    ID: "ID",
    /** LASTMODIFIEDTIME */
    LASTMODIFIEDTIME: "LASTMODIFIEDTIME",
    /** NICKNAME */
    NICKNAME: "NICKNAME",
    /** SERVICESTATUS */
    SERVICESTATUS: "SERVICESTATUS",
    /** SIZE */
    SIZE: "SIZE",
    /** STATUS */
    STATUS: "STATUS",
    /** TYPE */
    TYPE: "TYPE",
    /** UPDATETIME */
    UPDATETIME: "UPDATETIME",
    /** USERNAME */
    USERNAME: "USERNAME"
};

/**
 * @enum FilterField {number}
 * @category iPortal/Online
 * @description 关键字查询时的过滤字段。
 */
var FilterField = {
    /** LINKPAGE */
    LINKPAGE: "LINKPAGE",
    /** LINKPAGE */
    MAPTITLE: "MAPTITLE",
    /** LINKPAGE */
    NICKNAME: "NICKNAME",
    /** LINKPAGE */
    RESTITLE: "RESTITLE",
    /** LINKPAGE */
    USERNAME: "USERNAME"
};
export {
    ServiceStatus,
    DataItemOrderBy,
    FilterField
}
