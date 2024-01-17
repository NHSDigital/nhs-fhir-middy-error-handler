FROM mcr.microsoft.com/devcontainers/base:ubuntu

# System updates
RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y dist-upgrade \
    && apt-get -y install --no-install-recommends \
    git make

# Python dependencies
RUN apt-get -y install --no-install-recommends \
    libffi-dev libsqlite3-dev

USER vscode

# Install ASDF
RUN git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.11.3; \
    echo '. $HOME/.asdf/asdf.sh' >> ~/.bashrc; \
    echo '. $HOME/.asdf/completions/asdf.bash' >> ~/.bashrc;

ENV PATH="$PATH:/home/vscode/.asdf/bin/:/workspaces/nhs-fhir-middy-error-handler/node_modules/.bin"

# Install ASDF plugins
RUN asdf plugin add python; \
    asdf plugin add poetry https://github.com/asdf-community/asdf-poetry.git; \
    asdf plugin add shellcheck https://github.com/luizm/asdf-shellcheck.git; \
    asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git; \
    asdf plugin-add direnv;

WORKDIR /workspaces/nhs-fhir-middy-error-handler
ADD .tool-versions /workspaces/nhs-fhir-middy-error-handler/.tool-versions
ADD .tool-versions /home/vscode/.tool-versions

RUN asdf install; \
    asdf reshim python; \
    asdf reshim poetry; \
    asdf reshim nodejs; \
    asdf direnv setup --shell bash --version 2.32.2;
