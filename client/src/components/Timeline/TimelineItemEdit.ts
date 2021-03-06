import { Box, Flex } from 'reflexbox';
import { Button, Input, Select, Tooltip } from 'antd';
import { PlayCircleOutlined, SaveOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect, memo } from 'react';
import { ColorPicker } from './ColorPicker';
import { Logger } from '../../logger';

interface IProps {
    selectedTimelineItem: any;
    saveTimelineItem: any;
    changeColorForApp?: any;
    colorScopeHidden?: boolean;
    showCloseBtn?: boolean;
    showDeleteBtn?: boolean;
    showPlayIcon?: boolean;
    clearTimelineItem?: any;
    deleteTimelineItem?: any;
}

const COLOR_SCOPE_ONLY_THIS = 'ONLY_THIS';

function propsAreEqual(prev, next) {
    if (prev.selectedTimelineItem && next.selectedTimelineItem) {
        const equalById = prev.selectedTimelineItem.id === next.selectedTimelineItem.id;
        if (!next.selectedTimelineItem.id) {
            return prev.selectedTimelineItem === next.selectedTimelineItem;
        }

        return equalById;
    }

    return false;
}

export const TimelineItemEdit = memo<IProps>(
    ({
        selectedTimelineItem,
        colorScopeHidden,
        showCloseBtn,
        showDeleteBtn,
        showPlayIcon,
        clearTimelineItem,
        saveTimelineItem,
        deleteTimelineItem,
    }) => {
        const [state, setState] = useState({
            trackItem: selectedTimelineItem,
            colorScope: COLOR_SCOPE_ONLY_THIS,
        });

        const { trackItem, colorScope } = state;

        useEffect(() => {
            Logger.debug('Selected timelineitem changed:', selectedTimelineItem);
            if (selectedTimelineItem) {
                setState({
                    trackItem: selectedTimelineItem,
                    colorScope: COLOR_SCOPE_ONLY_THIS,
                });
            }
        }, [selectedTimelineItem]);

        const changeColorHandler = color => {
            Logger.debug('Changed color:', color);

            setState({
                ...state,
                trackItem: {
                    ...state.trackItem,
                    color,
                },
            });
        };

        const changeAppName = e => {
            const { value } = e.target;
            Logger.debug('Changed app name:', value);

            setState({
                ...state,
                trackItem: {
                    ...state.trackItem,
                    app: value,
                },
            });
        };

        const changeAppTitle = e => {
            const { value } = e.target;
            Logger.debug('Changed app title:', value);

            setState({
                ...state,
                trackItem: {
                    ...state.trackItem,
                    title: value,
                },
            });
        };

        const closeEdit = () => {
            Logger.debug('Close TimelineItem');
            clearTimelineItem();
        };

        const changeColorScopeHandler = colorScope => {
            Logger.debug('Changed color scope:', colorScope);

            setState({
                ...state,
                colorScope,
            });
        };

        const saveBasedOnColorOptionHandler = () => {
            const { trackItem, colorScope } = state;

            saveTimelineItem(trackItem, colorScope);
        };

        const deleteItem = () => {
            const { trackItem } = state;

            deleteTimelineItem(trackItem);
        };

        if (!selectedTimelineItem) {
            Logger.debug('No trackItem');
            return null;
        }

        return (
            <Flex p={1} w={1}>
                <Box px={1} w={1 / 3}>
                    <Input value={trackItem.app} placeholder="App" onChange={changeAppName} />
                </Box>
                <Box px={1} flex="1">
                    <Input value={trackItem.title} placeholder="Title" onChange={changeAppTitle} />
                </Box>

                <Box px={1}>
                    <ColorPicker color={trackItem.color} onChange={changeColorHandler} />
                </Box>

                {!colorScopeHidden && (
                    <Box px={1}>
                        <Tooltip
                            placement="left"
                            title="Can also change color for all items or all future items"
                        >
                            <Select
                                value={colorScope}
                                style={{ width: 120 }}
                                onChange={changeColorScopeHandler}
                            >
                                <Select.Option value="ONLY_THIS">This trackItem</Select.Option>
                                <Select.Option value="NEW_ITEMS">Future items</Select.Option>
                                <Select.Option value="ALL_ITEMS">All items</Select.Option>
                            </Select>
                        </Tooltip>
                    </Box>
                )}
                <Box px={1}>
                    <Button
                        type="primary"
                        shape="circle"
                        icon={showPlayIcon ? <PlayCircleOutlined /> : <SaveOutlined />}
                        onClick={saveBasedOnColorOptionHandler}
                    />
                </Box>
                {showDeleteBtn && (
                    <Box px={1}>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={deleteItem}
                        />
                    </Box>
                )}
                {showCloseBtn && (
                    <Box px={1}>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<CloseOutlined />}
                            onClick={closeEdit}
                        />
                    </Box>
                )}
            </Flex>
        );
    },
    propsAreEqual,
);
