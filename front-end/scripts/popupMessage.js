class PopupMessage {
    constructor() {
        this.messageElement = document.createElement('div');
        this.textSpan = document.createElement('p');
        this.actionButton = document.createElement('button');
        this.closeButton = document.createElement('div');

        this.messageElement.style.left = window.innerWidth-550 + 'px';
        this.messageElement.style.top = 100 + 'px';
        this.messageElement.style.width = 500 + 'px';

        this.messageElement.style.position = 'absolute';
        this.messageElement.style.background = 'rgba(139, 151, 255, 0.58)';
        this.messageElement.style.color = 'white';
        this.messageElement.style.padding = '10px';
        this.messageElement.style.borderRadius = '5px';
        this.messageElement.style.font = 'Inter';
        this.messageElement.style.display = 'flex';
        this.messageElement.style.flexDirection = 'row';
        this.messageElement.style.justifyContent = 'space-between';
        this.messageElement.style.alignItems = 'center';

        this.closeButton.textContent = '⛌';
        this.closeButton.style.width = '15px';
        this.closeButton.style.height = '15px';
        this.closeButton.style.padding = '10px';
        this.closeButton.style.paddingTop = '15px';
        this.closeButton.style.position = 'absolute';
        this.closeButton.style.top = '0';
        this.closeButton.style.right = '0';
        this.closeButton.style.cursor = 'pointer';
        this.closeButton.style.color = 'white';
        this.closeButton.style.textAlign = 'center';
        this.closeButton.style.lineHeight = '0';
        this.closeButton.style.fontSize = '16pt';
        this.closeButton.addEventListener('mouseover', function() {
            this.style.fontWeight = 'bold';
        });
        this.closeButton.addEventListener('mouseout', function() {
           this.style.fontWeight = 'normal';
        });


        this.actionButton.style.background =  'none';
        this.actionButton.style.color = 'white';
        this.actionButton.style.padding = '10px';
        this.actionButton.style.borderRadius = '5px';
        this.actionButton.style.border = '1px solid white';
        this.actionButton.style.position = 'inline';
        this.actionButton.style.cursor = 'pointer';

        this.actionButton.style.marginRight = '40px';
        this.actionButton.style.marginLeft = '10px';
        this.actionButton.style.width = 'fit-content';
        this.actionButton.style.transition = 'background 0.3s ease';

        this.actionButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#7a83cf';
            this.style.color = 'white';
        });
        this.actionButton.addEventListener('mouseout', function() {
            this.style.color = 'white';
            this.style.background =  'none';
        });

        this.closeButton.addEventListener('click', () => this.hide());

        this.messageElement.appendChild(this.textSpan);
        this.messageElement.appendChild(this.actionButton);
        this.messageElement.appendChild(this.closeButton);
        document.body.appendChild(this.messageElement);
         this.messageElement.style.display = 'none';
    }

    show(messageText) {
        this.messageElement.style.display = 'block';
        this.actionButton.style.display = 'none';
        this.textSpan.textContent = messageText;
    }

    showButton(messageText, buttonText, buttonAction) {
        this.messageElement.style.display = 'block';
        this.actionButton.style.display = 'flex';
        this.textSpan.textContent = messageText;
        this.actionButton.textContent = buttonText;

        if (this.listener !== undefined){
         this.actionButton.removeEventListener('click', this.listener);
        }
        this.listener = buttonAction;
        this.actionButton.addEventListener('click', this.listener);
    }

    hide() {
        this.messageElement.style.display = 'none';
    }
}