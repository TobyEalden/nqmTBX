
appPalette = {
  primary1Color: mui.Styles.Colors.blueGrey500,
  primary2Color: mui.Styles.Colors.grey400,
  primary3Color: mui.Styles.Colors.blueGrey300,
  accent1Color: mui.Styles.Colors.orangeA400,
  accent2Color: mui.Styles.Colors.blueGrey200,
  accent3Color: mui.Styles.Colors.green,
  textColor: mui.Styles.Colors.white,
  canvasColor: mui.Styles.Colors.blueGrey300,
  borderColor: mui.Styles.Colors.grey300,

  nqmTBXListBackground: mui.Styles.Colors.blueGrey600,
  nqmTBXListTextColor: mui.Styles.Colors.grey300,
  nqmTBXListIconColor: mui.Styles.Colors.white,
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
    primaryColor: mui.Styles.Colors.amber800,
    secondaryColor: mui.Styles.Colors.orange300
  },
  textField: {
    hintColor: mui.Styles.Colors.grey500
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
  primary1Color: mui.Styles.Colors.deepPurple800,
  primary2Color: mui.Styles.Colors.grey400,
  primary3Color: mui.Styles.Colors.deepPurple200,
  accent1Color: mui.Styles.Colors.deepPurple400,
  accent2Color: mui.Styles.Colors.deepPurple100,
  accent3Color: mui.Styles.Colors.orangeA400,
  textColor: mui.Styles.Colors.grey900,
  canvasColor: mui.Styles.Colors.grey100,
  borderColor: mui.Styles.Colors.grey300,

  nqmTBXListBackground: mui.Styles.Colors.white,
  nqmTBXListTextColor: mui.Styles.Colors.grey700,
  nqmTBXListIconColor: mui.Styles.Colors.grey600
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
    textColor: mui.Styles.Colors.grey100,
    color: mui.Styles.Colors.deepPurpleA100,
    primaryColor: mui.Styles.Colors.purpleA700,
    secondaryColor: mui.Styles.Colors.purpleA100
  },
  textField: {
    hintColor: mui.Styles.Colors.grey500
  },
  listItem: {
    nestedLevelDepth: 12
  }
};
************/
