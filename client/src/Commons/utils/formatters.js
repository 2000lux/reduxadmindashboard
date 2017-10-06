import React from 'react'
import _ from 'lodash'

export const formatChildfield = (cell, row, extra) => {
    const value = _.get(row, extra.field);
    return <div>{value}</div>;
};

export const stripTags = (content) => {
    return content.replace(/(<([^>]+)>)/ig,"");
};