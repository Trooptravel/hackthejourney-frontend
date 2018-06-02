

function changeColor(action, color) {
  const shade = 1.3;
  const upperColor = color.toUpperCase();
  const colors = '0123456789ABCDEF';
  const tokens = upperColor.split('');
  const R = colors.indexOf(tokens[1]);
  const r = colors.indexOf(tokens[2]);
  const G = colors.indexOf(tokens[3]);
  const g = colors.indexOf(tokens[4]);
  const B = colors.indexOf(tokens[5]);
  const b = colors.indexOf(tokens[6]);
  var RR = 0;
  var GG = 0;
  var BB = 0;
  if (action === 'darken') {
    RR = Math.floor((R * 16 + r) / shade);
    GG = Math.floor((G * 16 + g) / shade);
    BB = Math.floor((B * 16 + b) / shade);
  }
  else {
    RR = Math.floor(((R * 16 + r) + 255) / 2);
    GG = Math.floor(((G * 16 + g) + 255) / 2);
    BB = Math.floor(((B * 16 + b) + 255) / 2);
  }

  const rR = Math.floor(RR / 16);
  const rr = RR % 16;
  const rG = Math.floor(GG / 16);
  const rg = GG % 16;
  const rB = Math.floor(BB / 16);
  const rb = BB % 16;

  const resultColor = '#' + colors[rR] + colors[rr] + colors[rG] + colors[rg] + colors[rB] + colors[rb];
  return resultColor;
}



function lighterColor(color) {
    return changeColor('lighten', color);
  }

  //***************************************************************

  function darkerColor(color) {
    return changeColor('darken', color);
  }

  //***************************************************************


window.darkerColor = darkerColor;
window.lighterColor = lighterColor;

//***************************************************************
