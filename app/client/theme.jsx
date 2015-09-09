
//appPalette = {
//  primary1Color: mui.Styles.Colors.blueGrey400,
//  primary2Color: mui.Styles.Colors.blueGrey700,
//  primary3Color: mui.Styles.Colors.blueGrey100,
//  //accent1Color: mui.Styles.Colors.white,
//  accent2Color: mui.Styles.Colors.white,
//  //accent3Color: mui.Styles.Colors.blueGrey500
//  canvasColor: mui.Styles.Colors.blueGrey700,
//  disabledTextColor: mui.Styles.Colors.grey600,
//
//  textColor: "#222"
//
//// rest of the palette is set from Theme Manager
//};

appPalette = {
  primary1Color: mui.Styles.Colors.grey600,
  primary2Color: mui.Styles.Colors.grey400,
  primary3Color: mui.Styles.Colors.grey200,
  accent1Color: mui.Styles.Colors.deepPurple200, //amberA700,
  accent2Color: mui.Styles.Colors.pink800,
  accent3Color: mui.Styles.Colors.pink600,
  textColor: mui.Styles.Colors.grey900,
  canvasColor: mui.Styles.Colors.grey200,
  borderColor: mui.Styles.Colors.grey300,
//  disabledColor: mui.Styles.ColorManipulator.fade(mui.Styles.Colors.darkBlack, 0.3)
};

componentThemes = {
  toolbar: {
    backgroundColor: appPalette.primary1Color
  },
  paper: {
    backgroundColor: appPalette.primary3Color
  },
  raisedButton: {
    textColor: appPalette.primary3Color,
    color: appPalette.primary2Color,
    primaryColor: mui.Styles.Colors.indigo200,
    secondaryColor: mui.Styles.Colors.red200, //lightBlueA700
  },
  textField: {
    hintColor: mui.Styles.Colors.grey500
  },
  listItem: {
    nestedLevelDepth: 12
  }
};

ThemeManager = new mui.Styles.ThemeManager();
ThemeManager.setPalette(appPalette);
ThemeManager.setComponentThemes(componentThemes);
//ThemeManager.setTheme(ThemeManager.types.DARK);

