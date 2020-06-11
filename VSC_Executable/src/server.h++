//
// Created by aldo on 10/6/20.
//

#ifndef DATOS_2___2_0_SERVER_H
#define DATOS_2___2_0_SERVER_H
#include <iostream>
#include <unistd.h>
#include <sys/socket.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <string.h>
#include <string>
using namespace std;
class server {
private:
    server();
    static server *instance;
    int port;
    string host;
public:
    static server *getInstance();
    void start();
};


#endif //DATOS_2___2_0_SERVER_H
