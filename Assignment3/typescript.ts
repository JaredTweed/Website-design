//npx tsc init
//npm init -y
//npm install -g typescript //installs typescript globally
//npx tsc typescript.ts //compiles typescript.ts to typescript.js

// Enum for Pig Categories
enum PigCategory {
  Grey = "Grey",
  Chestnut = "Chestnut",
  White = "White",
  Black = "Black"
}

// Base Pig Interface
interface IPig {
  name: string;
  height: number;
  weight: number;
  personality: string;
  category: PigCategory;
}

// Base Pig Class
class Pig implements IPig {
  name: string;
  height: number;
  weight: number;
  personality: string;
  category: PigCategory;

  constructor(name: string, height: number, weight: number, personality: string, category: PigCategory) {
    this.name = name;
    this.height = height;
    this.weight = weight;
    this.personality = personality;
    this.category = category;
  }
}

// Grey Pig Subclass
class GreyPig extends Pig {
  swimmingAbility: number;

  constructor(name: string, height: number, weight: number, personality: string, swimmingAbility: number) {
    super(name, height, weight, personality, PigCategory.Grey);
    this.swimmingAbility = swimmingAbility;
  }
}
  
// ChestnutPig Subclass
class ChestnutPig extends Pig {
  language: string;

  constructor(name: string, height: number, weight: number, personality: string, language: string) {
    super(name, height, weight, personality, PigCategory.Chestnut);
    this.language = language;
  }
}

// WhitePig Subclass
class WhitePig extends Pig {
  speed: number;

  constructor(name: string, height: number, weight: number, personality: string, runningAbility: number) {
    super(name, height, weight, personality, PigCategory.White);
    this.speed = runningAbility;
  }
}

// BlackPig Subclass
class BlackPig extends Pig {
  strengthAbility: number;

  constructor(name: string, height: number, weight: number, personality: string, strengthAbility: number) {
    super(name, height, weight, personality, PigCategory.Black);
    this.strengthAbility = strengthAbility;
  }
}

// LocalStorageUtil class
class LocalStorageUtil {
  static localStorageKey = 'farmerHoggettPigs';

  static savePig(pig: IPig) {
    const pigs = LocalStorageUtil.getPigs();
    pigs.push(pig);
    localStorage.setItem(LocalStorageUtil.localStorageKey, JSON.stringify(pigs));
  }

  static getPigs(): IPig[] {
    const pigsJson = localStorage.getItem(LocalStorageUtil.localStorageKey);
    if (pigsJson) {
      return JSON.parse(pigsJson) as IPig[];
    }
    return [];
  }

  static deletePig(pigName: string) {
    const pigs = LocalStorageUtil.getPigs();
    const filteredPigs = pigs.filter(pig => pig.name !== pigName);
    localStorage.setItem(LocalStorageUtil.localStorageKey, JSON.stringify(filteredPigs));
    updateTable(LocalStorageUtil.getPigs());
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form') as HTMLFormElement;
  const nameInput = document.querySelector('#name-data') as HTMLInputElement;
  const weightInput = document.querySelector('#weight-data') as HTMLInputElement;
  const heightInput = document.querySelector('#height-data') as HTMLInputElement;
  const personalityInput = document.querySelector('#personality-data') as HTMLInputElement;
  const categorySelect = document.querySelector('#category') as HTMLSelectElement;
  const swimmingInput = document.querySelector('#swimming-data') as HTMLInputElement;
  const languageInput = document.querySelector('#language-data') as HTMLInputElement;
  const speedInput = document.querySelector('#speed-data') as HTMLInputElement;
  const strengthInput = document.querySelector('#strength-data') as HTMLInputElement;

  // Clear all pigs from LocalStorage when the page loads
  const pigs = LocalStorageUtil.getPigs();
  pigs.forEach(pig => {
    LocalStorageUtil.deletePig(pig.name);
  });
  
  form.onsubmit = (event) => {
    event.preventDefault(); // Prevent form submission

    // Create pig object based on the input values
    const pig: IPig = {
      name: nameInput.value,
      weight: parseInt(weightInput.value),
      height: parseInt(heightInput.value),
      personality: personalityInput.value,
      category: categorySelect.value as PigCategory,
    };


    // Add specific properties based on the pig category
    switch (pig.category) {
      case PigCategory.Grey:
        (pig as GreyPig).swimmingAbility = parseInt(swimmingInput.value);
        break;
      case PigCategory.Chestnut:
        (pig as ChestnutPig).language = languageInput.value;
        break;
      case PigCategory.White:
        (pig as WhitePig).speed = parseInt(speedInput.value);
        break;
      case PigCategory.Black:
        (pig as BlackPig).strengthAbility = parseInt(strengthInput.value);
        break;
    }


    LocalStorageUtil.savePig(pig); // Use LocalStorageUtil to save the pig
    form.reset(); // Clear the form or provide feedback to the user
    updateTable(LocalStorageUtil.getPigs()); // Update HTML table
    
  };
});
  

function updateTable(pigs: IPig[]) {
  // const pigs = LocalStorageUtil.getPigs();
  const pigsTable = document.querySelector('#pigTable') as HTMLTableElement;
  
  // Clear all rows except the header row
  if (!pigsTable) {
    console.error('The table element does not exist!');
    return;
  }
  while (pigsTable.rows.length > 1) {
    pigsTable.deleteRow(-1); // delete the last row
  }


  pigs.forEach(pig => {
    const row = pigsTable.insertRow();
    const nameCell = row.insertCell();
    const categoryCell = row.insertCell();
    const infoCell = row.insertCell();
    const deleteCell = row.insertCell();
    
    nameCell.innerHTML = pig.name;
    categoryCell.innerHTML = pig.category;
    infoCell.innerHTML = '<button class="more-info-btn">More Info</button>';
    deleteCell.innerHTML = '<button onclick="LocalStorageUtil.deletePig(\'' + pig.name + '\')">Delete</button>';

    // Add event listener to More Info button
    const moreInfoBtn = infoCell.querySelector('.more-info-btn') as HTMLButtonElement;
    moreInfoBtn.addEventListener('click', () => {
      // Display pig's information in a modal or a separate page
      switch (pig.category) {
        case 'Grey':
          alert(`Name: ${pig.name}\nHeight: ${pig.height}\nWeight: ${pig.weight}\nPersonality: ${pig.personality}\nCategory: ${pig.category}\nSwimming ability: ${(pig as GreyPig).swimmingAbility}`);  
          break;
        case 'Chestnut':
          alert(`Name: ${pig.name}\nHeight: ${pig.height}\nWeight: ${pig.weight}\nPersonality: ${pig.personality}\nCategory: ${pig.category}\nLanguage: ${(pig as ChestnutPig).language}`);
          break;
        case 'White':
          alert(`Name: ${pig.name}\nHeight: ${pig.height}\nWeight: ${pig.weight}\nPersonality: ${pig.personality}\nCategory: ${pig.category}\nRunning ability: ${(pig as WhitePig).speed}`);
          break;
        case 'Black':
          alert(`Name: ${pig.name}\nHeight: ${pig.height}\nWeight: ${pig.weight}\nPersonality: ${pig.personality}\nCategory: ${pig.category}\nStrength: ${(pig as BlackPig).strengthAbility}`);
          break;
      }
    });
  });
}



// Showing and hiding input fields based on the category selection
document.addEventListener('DOMContentLoaded', () => {
  const select = document.querySelector('#category') as HTMLSelectElement;
  console.log(select.value);

  const grey_inputs = document.querySelectorAll('.grey-input') as NodeListOf<HTMLElement>;
  const chestnut_inputs = document.querySelectorAll('.chestnut-input') as NodeListOf<HTMLElement>;
  const white_inputs = document.querySelectorAll('.white-input') as NodeListOf<HTMLElement>;
  const black_inputs = document.querySelectorAll('.black-input') as NodeListOf<HTMLElement>;

  // Function to change display style for a NodeList
  function changeDisplayStyle(elements: NodeListOf<HTMLElement>, displayStyle: string) {
      elements.forEach(element => {
          element.style.display = displayStyle;
      });
  }

  changeDisplayStyle(grey_inputs, select.value == 'Grey' ? 'inline-block' : 'none');
  changeDisplayStyle(chestnut_inputs, select.value == 'Chestnut' ? 'inline-block' : 'none');
  changeDisplayStyle(white_inputs, select.value == 'White' ? 'inline-block' : 'none');
  changeDisplayStyle(black_inputs, select.value == 'Black' ? 'inline-block' : 'none');

  select.addEventListener('change', () => {
      // Re-querying the elements is redundant if they don't change, 
      // so this step can be optimized out unless there's a specific reason for re-querying.

      // Update the display style based on selection
      changeDisplayStyle(grey_inputs, select.value == 'Grey' ? 'inline-block' : 'none');
      changeDisplayStyle(chestnut_inputs, select.value == 'Chestnut' ? 'inline-block' : 'none');
      changeDisplayStyle(white_inputs, select.value == 'White' ? 'inline-block' : 'none');
      changeDisplayStyle(black_inputs, select.value == 'Black' ? 'inline-block' : 'none');
  });
});

