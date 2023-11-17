import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

const CustomGridLayout = ({ columns, gap = 0, data, styleLayout, styleCell, header, footer, handleEndReached }) => {
    const calculateRows = () => {
        return Math.ceil(data?.length / columns);
    };

    const handleScroll = (event) => {
        if (handleEndReached) {
            const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
            const endReachedThreshold = 150;
            if (contentOffset.y + layoutMeasurement.height >= contentSize.height - endReachedThreshold) {
                handleEndReached();
            }
        }
    };

    const renderGrid = () => {
        const grid = [];
        for (let i = 0; i < calculateRows(); i++) {
            const row = [];
            for (let j = 0; j < columns; j++) {
                const dataIndex = i * columns + j;
                if (dataIndex < data?.length) {
                    const item = data[dataIndex];
                    row.push(
                        <View style={[styles.column, styleCell]} key={`column_${i}_${j}`}>
                            {item}
                        </View>,
                    );

                    if (j < columns - 1) {
                        row.push(<View style={{ width: gap }} key={`gapRow_${i}_${j}`} />);
                    }
                } else {
                    row.push(<View style={[styles.column, styleCell, styles.emptyCell]} key={`emptyCell_${i}_${j}`} />);
                    if (j < columns - 1) {
                        row.push(<View style={{ width: gap }} key={`gapRow_${i}_${j}`} />);
                    }
                }
            }

            grid.push(
                <View style={styles.row} key={`row_${i}`}>
                    {row}
                </View>,
            );

            if (i < calculateRows() - 1) {
                grid.push(
                    <View style={{ width: gap, height: gap }} key={`gapColumn_${i}`}>
                        <View style={{ width: gap }} />
                    </View>,
                );
            }
        }

        return grid;
    };

    return (
        <ScrollView onScroll={handleScroll} vertical={true} showsVerticalScrollIndicator={false} style={[styles.gridLayout, styleLayout]}>
            {header}
            {renderGrid()}
            {footer}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    gridLayout: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
    column: {
        flex: 1,
    },
    emptyCell: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
    },
});

export default CustomGridLayout;
