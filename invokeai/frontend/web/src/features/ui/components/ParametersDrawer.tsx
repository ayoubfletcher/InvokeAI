import { isEqual } from 'lodash-es';
import { createSelector } from '@reduxjs/toolkit';
import { lightboxSelector } from 'features/lightbox/store/lightboxSelectors';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { PropsWithChildren, memo, useMemo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import InvokeAILogoComponent from 'features/system/components/InvokeAILogoComponent';
import OverlayScrollable from './common/OverlayScrollable';
import { PARAMETERS_PANEL_WIDTH } from 'theme/util/constants';
import {
  activeTabNameSelector,
  uiSelector,
} from 'features/ui/store/uiSelectors';
import { setShouldShowParametersPanel } from 'features/ui/store/uiSlice';
import ResizableDrawer from './common/ResizableDrawer/ResizableDrawer';
import PinParametersPanelButton from './PinParametersPanelButton';
import TextTabParameters from './tabs/text/TextTabParameters';
import ImageTabParameters from './tabs/image/ImageTabParameters';
import { defaultSelectorOptions } from 'app/store/util/defaultMemoizeOptions';
import UnifiedCanvasParameters from './tabs/UnifiedCanvas/UnifiedCanvasParameters';

const selector = createSelector(
  [uiSelector, activeTabNameSelector, lightboxSelector],
  (ui, activeTabName, lightbox) => {
    const {
      shouldPinParametersPanel,
      shouldShowParametersPanel,
      shouldShowImageParameters,
    } = ui;

    const { isLightboxOpen } = lightbox;

    return {
      activeTabName,
      shouldPinParametersPanel,
      shouldShowParametersPanel,
      shouldShowImageParameters,
    };
  },
  defaultSelectorOptions
);

const ParametersDrawer = () => {
  const dispatch = useAppDispatch();
  const { shouldPinParametersPanel, shouldShowParametersPanel, activeTabName } =
    useAppSelector(selector);

  const handleClosePanel = () => {
    dispatch(setShouldShowParametersPanel(false));
  };

  const drawerContent = useMemo(() => {
    if (activeTabName === 'text') {
      return <TextTabParameters />;
    }

    if (activeTabName === 'image') {
      return <ImageTabParameters />;
    }

    if (activeTabName === 'unifiedCanvas') {
      return <UnifiedCanvasParameters />;
    }

    return null;
  }, [activeTabName]);

  if (shouldPinParametersPanel) {
    return null;
  }

  return (
    <ResizableDrawer
      direction="left"
      isResizable={false}
      isOpen={shouldShowParametersPanel}
      onClose={handleClosePanel}
    >
      <Flex
        sx={{ flexDir: 'column', h: 'full', w: PARAMETERS_PANEL_WIDTH, gap: 2 }}
      >
        <Flex
          paddingTop={1.5}
          paddingBottom={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <InvokeAILogoComponent />
          <PinParametersPanelButton />
        </Flex>
        <OverlayScrollable>
          <Flex sx={{ flexDir: 'column', gap: 2 }}>{drawerContent}</Flex>
        </OverlayScrollable>
      </Flex>
    </ResizableDrawer>
  );
};

export default memo(ParametersDrawer);