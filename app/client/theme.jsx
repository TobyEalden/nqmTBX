
appPalette = {
  primary1Color: mui.Styles.Colors.blueGrey500,    // Toolbars and title bar.
  primary2Color: mui.Styles.Colors.blueGrey400,
  primary3Color: mui.Styles.Colors.blueGrey300,
  accent1Color: mui.Styles.Colors.blueGreyA400,
  accent2Color: mui.Styles.Colors.blueGrey200,
  accent3Color: mui.Styles.Colors.blueGrey50,      // Main page background.
  textColor: mui.Styles.Colors.white,
  canvasColor: mui.Styles.Colors.blueGrey300,
  borderColor: mui.Styles.Colors.blueGrey300,

  nqmTBXListBackground: mui.Styles.Colors.blueGrey100,
  nqmTBXListTextColor: mui.Styles.Colors.blueGrey900,
  nqmTBXListIconColor: mui.Styles.Colors.grey700,
  disabledColor: mui.Utils.ColorManipulator.fade(mui.Styles.Colors.darkBlack, 0.3)
};

componentThemes = {
  toolbar: {
    backgroundColor: appPalette.primary1Color
  },
  paper: {
    backgroundColor: appPalette.canvasColor
  },
  raisedButton: {
    textColor: appPalette.primary3Color,
    color: mui.Styles.Colors.blueGrey200,
    primaryColor: mui.Styles.Colors.amber800,     // Amber
    secondaryColor: mui.Styles.Colors.blueGrey300   // Orange
  },
  textField: {
    hintColor: mui.Styles.Colors.blueGrey500
  },
  listItem: {
    nestedLevelDepth: 6
  }
};

ThemeManager = new mui.Styles.ThemeManager();
ThemeManager.setPalette(appPalette);
ThemeManager.setComponentThemes(componentThemes);
// appPalette = ThemeManager.palette;
// ThemeManager.setTheme(ThemeManager.types.DARK);


/****
Horrible purple scheme

appPalette = {
  primary1Color: mui.Styles.Colors.blueGrey800,
  primary2Color: mui.Styles.Colors.blueGrey400,
  primary3Color: mui.Styles.Colors.blueGrey200,
  accent1Color: mui.Styles.Colors.blueGrey400,
  accent2Color: mui.Styles.Colors.blueGrey100,
  accent3Color: mui.Styles.Colors.blueGreyA400,
  textColor: mui.Styles.Colors.blueGrey900,
  canvasColor: mui.Styles.Colors.blueGrey100,
  borderColor: mui.Styles.Colors.blueGrey300,

  nqmTBXListBackground: mui.Styles.Colors.white,
  nqmTBXListTextColor: mui.Styles.Colors.blueGrey700,
  nqmTBXListIconColor: mui.Styles.Colors.blueGrey600
//  disabledColor: mui.Styles.ColorManipulator.fade(mui.Styles.Colors.darkBlack, 0.3)
};

componentThemes = {
  toolbar: {
    backgroundColor: appPalette.primary1Color
  },
  paper: {
    backgroundColor: appPalette.canvasColor
  },
  raisedButton: {
    textColor: mui.Styles.Colors.blueGrey100,
    color: mui.Styles.Colors.blueGreyA100,
    primaryColor: mui.Styles.Colors.purpleA700,
    secondaryColor: mui.Styles.Colors.purpleA100
  },
  textField: {
    hintColor: mui.Styles.Colors.blueGrey500
  },
  listItem: {
    nestedLevelDepth: 12
  }
};
************/
